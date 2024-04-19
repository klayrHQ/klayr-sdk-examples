import { CreateTokenParams } from '@app/modules/token_factory/commands/create_token_command';
import { createTokenSchema } from '@app/modules/token_factory/schemas';
import {
	CommandExecuteContext,
	CommandVerifyContext,
	Transaction,
	cryptography,
	testing,
} from 'klayr-sdk';

export type contextType = 'verify' | 'execute';

export function createSampleTransaction(params: Buffer, command: string, sender?: string) {
	return {
		module: 'token_factory',
		command,
		senderPublicKey: Buffer.from(
			sender ?? '3bb9a44b71c83b95045486683fc198fe52dcf27b55291003590fcebff0a45d9a',
			'hex',
		),
		nonce: BigInt(0),
		fee: BigInt(100000000),
		params,
		signatures: [cryptography.utils.getRandomBytes(64)],
	};
}

export function createCtx<T>(
	stateStore: any,
	transaction: Transaction,
	schema: any,
	contextType: contextType,
): CommandVerifyContext<T> | CommandExecuteContext<T> {
	const context = testing.createTransactionContext({
		stateStore,
		transaction,
		header: testing.createFakeBlockHeader({}),
	});

	return contextType === 'verify'
		? context.createCommandVerifyContext<T>(schema)
		: context.createCommandExecuteContext<T>(schema);
}

export function createCreateTokenCtx(
	stateStore: any,
	transaction: Transaction,
	contextType: contextType,
): CommandVerifyContext<CreateTokenParams> | CommandExecuteContext<CreateTokenParams> {
	const context = testing.createTransactionContext({
		stateStore,
		transaction,
		header: testing.createFakeBlockHeader({}),
	});

	return contextType === 'verify'
		? context.createCommandVerifyContext<CreateTokenParams>(createTokenSchema)
		: context.createCommandExecuteContext<CreateTokenParams>(createTokenSchema);
}

export class TokenID {
	constructor(public tokenID: number) {}
	toBuffer(): Buffer {
		const tokenIDBuffer = Buffer.alloc(4);
		tokenIDBuffer.writeUInt32BE(this.tokenID);

		return Buffer.concat([
			// default genesis chainID
			Buffer.from('12345678'),
			tokenIDBuffer,
		]);
	}
}
