import { BINARY_ADDRESS_LENGTH, DEFAULT_KLAYR32_ADDRESS_PREFIX, GENERATOR, KLAYR32_CHARSET } from '@/utils/constants';

if (typeof window !== "undefined") window.Buffer = window.Buffer || require("buffer").Buffer;

const cryptoHashSha256 = async (data: ArrayBuffer) =>
  // eslint-disable-next-line no-restricted-globals
  await crypto.subtle.digest('sha-256', data);

export const hash = async (data: Buffer | string, format?: string) => {
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
  uint5Array.map((val: number) => KLAYR32_CHARSET[val]).join('');

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

export const getAddressFromPublicKey = async (publicKey: Buffer) => {
  const buffer = Buffer.from(await hash(publicKey));
  const truncatedBuffer = buffer.slice(0, BINARY_ADDRESS_LENGTH);

  if (truncatedBuffer.length !== BINARY_ADDRESS_LENGTH) {
    throw new Error(`Lisk address must contain exactly ${BINARY_ADDRESS_LENGTH} bytes`);
  }

  return truncatedBuffer;
};

export const addressToKlayr32 = (address: Buffer): string => {
  const byteSequence = [];
  // @ts-ignore
  for (const b of address) {
    byteSequence.push(b);
  }
  const uint5Address = convertUIntArray(byteSequence, 8, 5);
  const uint5Checksum = createChecksum(uint5Address);
  return convertUInt5ToBase32(uint5Address.concat(uint5Checksum));
};

export const getKlayr32AddressFromPublicKey = async (
  publicKey: Buffer,
  prefix = DEFAULT_KLAYR32_ADDRESS_PREFIX,
) => `${prefix}${addressToKlayr32(await getAddressFromPublicKey(publicKey))}`;
