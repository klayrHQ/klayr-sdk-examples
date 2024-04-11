import {
	CreateTokenCommand,
	CreateTokenParams,
} from '@app/modules/token_factory/commands/create_token_command';
import { createTokenSchema } from '@app/modules/token_factory/schema';
import {
	CommandExecuteContext,
	CommandVerifyContext,
	Transaction,
	cryptography,
	testing,
} from 'lisk-sdk';

export type contextType = 'verify' | 'execute';

export function createSampleTransaction(params: Buffer) {
	return {
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
	};
}

export function createContext(
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
