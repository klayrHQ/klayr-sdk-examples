import * as crypto from 'crypto';
import { emptySchema, Schema, codec } from '@liskhq/lisk-codec';
import { validator } from '@liskhq/lisk-validator';
export const DEFAULT_LISK32_ADDRESS_PREFIX = 'lsk';
export const BINARY_ADDRESS_LENGTH = 20;
export const LISK32_ADDRESS_LENGTH = 41;
export const LISK32_CHARSET = 'zxvcpmbn3465o978uyrtkqew2adsjhfg'
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

export const validateTransaction = (
  transaction: Record<string, unknown>,
  paramsSchema: object = emptySchema,
) => {
  const transactionWithEmptyParams = {
    ...transaction,
    params: Buffer.alloc(0),
  };
  validator.validate(baseTransactionSchema, transactionWithEmptyParams);

  if (typeof transaction.params !== 'object' || transaction.params === null) {
    throw new Error('Transaction object params must be of type object and not null');
  }
  validator.validate(paramsSchema, transaction.params);
};

export const baseTransactionSchema = {
  $id: '/lisk/baseTransaction',
  type: 'object',
  required: ['module', 'command', 'nonce', 'fee', 'senderPublicKey', 'params'],
  properties: {
    module: {
      dataType: 'string',
      fieldNumber: 1,
    },
    command: {
      dataType: 'string',
      fieldNumber: 2,
    },
    nonce: {
      dataType: 'uint64',
      fieldNumber: 3,
    },
    fee: {
      dataType: 'uint64',
      fieldNumber: 4,
    },
    senderPublicKey: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
    params: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    signatures: {
      type: 'array',
      items: {
        dataType: 'bytes',
      },
      fieldNumber: 7,
    },
  },
};

const encodeParams = (
  transaction: Record<string, unknown>,
  paramsSchema = emptySchema as object,
): Buffer => {
  validateTransaction(transaction, paramsSchema);

  const hasParams =
    typeof transaction.params === 'object' && transaction.params !== null && paramsSchema;

  return hasParams
    ? codec.encode(paramsSchema as unknown as Schema, transaction.params as object)
    : Buffer.alloc(0);
};

export const getSigningBytes = (
  transaction: Record<string, unknown>,
  paramsSchema?: object,
): Buffer => {
  const params = encodeParams(transaction, paramsSchema);

  return codec.encode(baseTransactionSchema, { ...transaction, params, signatures: [], });
};

const cryptoHashSha256 = (data: Buffer): Buffer => {
  const dataHash = crypto.createHash('sha256');
  dataHash.update(data);

  return dataHash.digest();
};

export const hash = (data: Buffer | string, format?: string): Buffer => {
  if (Buffer.isBuffer(data)) {
    return cryptoHashSha256(data);
  }

  if (typeof data === 'string' && typeof format === 'string') {
    if (!['utf8', 'hex'].includes(format)) {
      throw new Error('Unsupported string format. Currently only `hex` and `utf8` are supported.');
    }
    const encoded = format === 'utf8' ? Buffer.from(data, 'utf8') : Buffer.from(data, 'hex');

    return cryptoHashSha256(encoded);
  }

  throw new Error(
    `Unsupported data:${data} and format:${
      format ?? 'undefined'
    }. Currently only Buffers or hex and utf8 strings are supported.`,
  );
};

const convertUInt5ToBase32 = (uint5Array: number[]): string =>
  uint5Array.map((val: number) => LISK32_CHARSET[val]).join('');

// See for details: https://github.com/LiskHQ/lips/blob/master/proposals/lip-0018.md#creating-checksum
const polymod = (uint5Array: number[]): number => {
  let chk = 1;
  for (const value of uint5Array) {
    // eslint-disable-next-line no-bitwise
    const top = chk >> 25;
    // eslint-disable-next-line no-bitwise
    chk = ((chk & 0x1ffffff) << 5) ^ value;
    for (let i = 0; i < 5; i += 1) {
      // eslint-disable-next-line no-bitwise
      if ((top >> i) & 1) {
        // eslint-disable-next-line no-bitwise
        chk ^= GENERATOR[i];
      }
    }
  }

  return chk;
};

const createChecksum = (uint5Array: number[]): number[] => {
  const values = uint5Array.concat([0, 0, 0, 0, 0, 0]);
  // eslint-disable-next-line no-bitwise
  const mod = polymod(values) ^ 1;
  const result = [];
  for (let p = 0; p < 6; p += 1) {
    // eslint-disable-next-line no-bitwise
    result.push((mod >> (5 * (5 - p))) & 31);
  }
  return result;
};

const convertUIntArray = (uintArray: number[], fromBits: number, toBits: number): number[] => {
  // eslint-disable-next-line no-bitwise
  const maxValue = (1 << toBits) - 1;
  let accumulator = 0;
  let bits = 0;
  const result = [];
  // eslint-disable-next-line
  for (let p = 0; p < uintArray.length; p += 1) {
    const byte = uintArray[p];
    // check that the entry is a value between 0 and 2^frombits-1
    // eslint-disable-next-line no-bitwise
    if (byte < 0 || byte >> fromBits !== 0) {
      return [];
    }

    // eslint-disable-next-line no-bitwise
    accumulator = (accumulator << fromBits) | byte;
    bits += fromBits;
    while (bits >= toBits) {
      bits -= toBits;
      // eslint-disable-next-line no-bitwise
      result.push((accumulator >> bits) & maxValue);
    }
  }

  return result;
};

export const getAddressFromPublicKey = (publicKey: Buffer): Buffer => {
  const buffer = hash(publicKey);
  const truncatedBuffer = buffer.slice(0, BINARY_ADDRESS_LENGTH);

  if (truncatedBuffer.length !== BINARY_ADDRESS_LENGTH) {
    throw new Error(`Lisk address must contain exactly ${BINARY_ADDRESS_LENGTH} bytes`);
  }

  return truncatedBuffer;
};

export const addressToLisk32 = (address: Buffer): string => {
  const byteSequence = [];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  for (const b of address) {
    byteSequence.push(b);
  }
  const uint5Address = convertUIntArray(byteSequence, 8, 5);
  const uint5Checksum = createChecksum(uint5Address);
  return convertUInt5ToBase32(uint5Address.concat(uint5Checksum));
};

export const getLisk32AddressFromPublicKey = (
  publicKey: Buffer,
  prefix = DEFAULT_LISK32_ADDRESS_PREFIX,
): string => `${prefix}${addressToLisk32(getAddressFromPublicKey(publicKey))}`;
