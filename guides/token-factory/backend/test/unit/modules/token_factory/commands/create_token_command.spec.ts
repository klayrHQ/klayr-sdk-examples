import {
	CreateTokenCommand,
	CreateTokenParams,
} from '@app/modules/token_factory/commands/create_token_command';
import { TokenFactoryModule } from '@app/modules/token_factory/module';
import { createTokenSchema } from '@app/modules/token_factory/schema';
import { ModuleConfig } from '@app/modules/token_factory/types';
import { CommandExecuteContext, Transaction, VerifyStatus, chain, codec, db } from 'lisk-sdk';
import { createContext, createSampleTransaction } from '@test/helpers';
import { TokenStore } from '@app/modules/token_factory/stores/token';
import { CounterStore, counterKey } from '@app/modules/token_factory/stores/counter';
import { OwnerStore } from '@app/modules/token_factory/stores/owner';

describe('CreateTokenCommand', () => {
	const initConfig = {
		maxNameLength: 30,
		maxSymbolLength: 6,
		maxTotalSupply: BigInt(1e6),
	};
	const defaultToken = {
		name: 'The real pepe coin',
		symbol: 'PEPE',
		totalSupply: BigInt(1e4),
	};
	const defaultValidParams = codec.encode(createTokenSchema, defaultToken);
	const mockMint = jest.fn();

	let command: CreateTokenCommand;
	let stateStore: any;
	let counterStore: CounterStore;
	let tokenStore: TokenStore;
	let ownerStore: OwnerStore;

	beforeEach(async () => {
		const tokenFactory = new TokenFactoryModule();

		command = new CreateTokenCommand(tokenFactory.stores, tokenFactory.events);
		command.addDependencies({ tokenMethod: { mint: mockMint } } as any);
		await command.init(initConfig as ModuleConfig);

		stateStore = new chain.StateStore(new db.InMemoryDatabase());
		tokenStore = tokenFactory.stores.get(TokenStore);
		counterStore = tokenFactory.stores.get(CounterStore);
		ownerStore = tokenFactory.stores.get(OwnerStore);
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
				const paramWithInvalidTotalSupply = codec.encode(createTokenSchema, {
					name: 'The real pepe coin',
					symbol: 'PEPE',
					totalSupply: initConfig.maxTotalSupply + BigInt(1), // invalid totalSupply
				});
				const transaction = new Transaction(createSampleTransaction(paramWithInvalidTotalSupply));
				const context = createContext(stateStore, transaction, 'verify');

				const result = await command.verify(context);
				expect(result.status).toBe(VerifyStatus.FAIL);
			});

			it('should be ok when valid params', async () => {
				const transaction = new Transaction(createSampleTransaction(defaultValidParams));
				const context = createContext(stateStore, transaction, 'verify');

				const result = await command.verify(context);
				expect(result.status).toBe(VerifyStatus.OK);
			});
		});
	});

	describe('execute', () => {
		describe('valid cases', () => {
			it('mint function should have been called', async () => {
				const transaction = new Transaction(createSampleTransaction(defaultValidParams));
				const context = createContext(stateStore, transaction, 'execute');

				await expect(
					command.execute(context as CommandExecuteContext<CreateTokenParams>),
				).resolves.toBeUndefined();
				expect(mockMint).toHaveBeenCalledTimes(1);
			});

			it('should update the `token`, `counter` and `owner` store', async () => {
				const transaction = new Transaction(createSampleTransaction(defaultValidParams));
				const currentTokenIDBuff = Buffer.alloc(8);
				currentTokenIDBuff.writeBigUInt64BE(BigInt(1));

				const context = createContext(stateStore, transaction, 'execute');

				await expect(
					command.execute(context as CommandExecuteContext<CreateTokenParams>),
				).resolves.toBeUndefined();

				const token = await tokenStore.get(context, currentTokenIDBuff);
				const tokenIdCounter = await counterStore.get(context, counterKey);
				const owner = await ownerStore.get(context, currentTokenIDBuff);

				expect(token.tokenID).toBe(BigInt(1));
				expect(token.name).toBe(defaultToken.name);
				expect(token.symbol).toBe(defaultToken.symbol);
				expect(token.totalSupply).toBe(defaultToken.totalSupply);

				expect(tokenIdCounter.counter).toBe(BigInt(1));

				expect(owner.address.equals(transaction.senderAddress)).toBe(true);
			});
		});

		describe('invalid cases', () => {
			// will add when mint function is implemented
			it.todo('should throw error');
		});
	});
});
