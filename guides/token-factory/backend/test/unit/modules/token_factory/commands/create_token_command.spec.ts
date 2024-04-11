import {
	CreateTokenCommand,
	CreateTokenParams,
} from '@app/modules/token_factory/commands/create_token_command';
import { TokenFactoryModule } from '@app/modules/token_factory/module';
import { createTokenSchema } from '@app/modules/token_factory/schema';
import { ModuleConfig } from '@app/modules/types';
import { Transaction, VerifyStatus, chain, codec, db, testing } from 'lisk-sdk';
import { createSampleTransaction } from '@test/helpers';

describe('CreateTokenCommand', () => {
	const initConfig = {
		maxNameLength: 30,
		maxSymbolLength: 6,
		maxTotalSupply: 1e18,
	};
	const defaultValidParams = codec.encode(createTokenSchema, {
		name: 'The real pepe coin',
		symbol: 'PEPE',
		totalSupply: BigInt(initConfig.maxTotalSupply - 1e6),
	});

	let command: CreateTokenCommand;
	let stateStore: any;

	beforeEach(async () => {
		const tokenFactory = new TokenFactoryModule();

		command = new CreateTokenCommand(tokenFactory.stores, tokenFactory.events);
		command.addDependencies({ tokenMethod: { mint: jest.fn() } } as any);
		await command.init(initConfig as ModuleConfig);

		stateStore = new chain.StateStore(new db.InMemoryDatabase());
		// tokenStore = tokenFactory.stores.get(TokenStore);
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('createToken');
		});

		it('should have valid schema', () => {
			expect(command.schema).toMatchSnapshot();
		});
	});

	describe('verify', () => {
		describe('schema validation', () => {
			it('should throw when `totalSupply` is too high', async () => {
				const invalidParam = codec.encode(createTokenSchema, {
					name: 'The real pepe coin',
					symbol: 'PEPE',
					totalSupply: BigInt(initConfig.maxTotalSupply + 1e6), // invalid totalSupply
				});
				const transaction = new Transaction(createSampleTransaction(invalidParam));
				const context = testing
					.createTransactionContext({
						stateStore,
						transaction,
						header: testing.createFakeBlockHeader({}),
					})
					.createCommandVerifyContext<CreateTokenParams>(createTokenSchema);

				const result = await command.verify(context);
				expect(result.status).toBe(VerifyStatus.FAIL);
			});

			it('should be ok when valid params', async () => {
				const transaction = new Transaction(createSampleTransaction(defaultValidParams));
				const context = testing
					.createTransactionContext({
						stateStore,
						transaction,
						header: testing.createFakeBlockHeader({}),
					})
					.createCommandVerifyContext<CreateTokenParams>(createTokenSchema);

				const result = await command.verify(context);
				expect(result.status).toBe(VerifyStatus.OK);
			});
		});
	});

	describe('execute', () => {
		describe('valid cases', () => {
			it('should update the state store', async () => {
				const transaction = new Transaction(createSampleTransaction(defaultValidParams));
				const context = testing
					.createTransactionContext({
						stateStore,
						transaction,
						header: testing.createFakeBlockHeader({}),
					})
					.createCommandExecuteContext<CreateTokenParams>(createTokenSchema);

				await command.execute(context);
			});
		});

		describe('invalid cases', () => {
			it.todo('should throw error');
		});
	});
});
