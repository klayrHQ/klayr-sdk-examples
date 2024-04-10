import { CreateTokenCommand } from '@app/modules/token_factory/commands/create_token_command';

import { cryptography } from 'lisk-sdk';

export const createSampleTransaction = (params: Buffer) => ({
	module: 'token_factory',
	command: CreateTokenCommand.name,
	senderPublicKey: Buffer.from(
		'3bb9a44b71c83b95045486683fc198fe52dcf27b55291003590fcebff0a45d9a',
		'hex',
	),
	nonce: BigInt(0),
	fee: BigInt(100000000),
	params,
	signatures: [cryptography.utils.getRandomBytes(64)],
});
