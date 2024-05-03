import {
	CreateTokenCommand,
	CreateTokenParams,
} from '@app/modules/token_factory/commands/create_token_command';
import { TokenFactoryEndpoint } from '@app/modules/token_factory/endpoint';
import { InternalMethod } from '@app/modules/token_factory/internal_methods';
import { TokenFactoryModule } from '@app/modules/token_factory/module';
import { ModuleConfig } from '@app/modules/token_factory/types';
import { createTokenSchema as createSchema } from '@app/modules/token_factory/schemas';
import { TokenID, createCtx, createSampleTransaction } from '@test/helpers';
import { CommandExecuteContext, Transaction, chain, codec, db, testing } from 'klayr-sdk';

describe('TokenFactoryModuleEndpoint', () => {
	const initConfig = {
		maxNameLength: 30,
		maxSymbolLength: 6,
		maxTotalSupply: BigInt(1e6),
		chainID: Buffer.from('12345678'),
	};

	const testToken = {
		name: 'The og pepe coin',
		symbol: 'PEPEOG',
		totalSupply: BigInt(1e4),
	};

	const tokenID = new TokenID(1).toBuffer();
	const mockMint = jest.fn();
	const mockInitialize = jest.fn();

	let tokenFactory: TokenFactoryModule;
	let createCmd: CreateTokenCommand;
	let endpoint: TokenFactoryEndpoint;
	let stateStore: any;

	beforeAll(async () => {
		tokenFactory = new TokenFactoryModule();
		const internalMethod = new InternalMethod(tokenFactory.stores, tokenFactory.events);
		await internalMethod.init(initConfig.chainID);

		createCmd = new CreateTokenCommand(tokenFactory.stores, tokenFactory.events);
		createCmd.addDependencies({
			internalMethod,
			tokenMethod: { mint: mockMint, initializeToken: mockInitialize },
		} as any);
		await createCmd.init(initConfig as ModuleConfig);

		stateStore = new chain.StateStore(new db.InMemoryDatabase());
		endpoint = new TokenFactoryEndpoint(tokenFactory.stores, tokenFactory.offchainStores);
	});

	describe('getTokenInfo', () => {
		// Create test token so it can be retrieved
		beforeEach(async () => {
			const defaultValidParams = codec.encode(createSchema, testToken);
			const transaction = new Transaction(
				createSampleTransaction(defaultValidParams, CreateTokenCommand.name),
			);
			const ctx = createCtx<CreateTokenParams>(stateStore, transaction, createSchema, 'execute');

			await expect(
				createCmd.execute(ctx as CommandExecuteContext<CreateTokenParams>),
			).resolves.toBeUndefined();
		});

		it('Should fail with incorrect tokenID', async () => {
			const ctx = testing.createTransientModuleEndpointContext({
				stateStore,
				params: {
					tokenID: '123',
				},
			});

			await expect(endpoint.getTokenInfo(ctx)).rejects.toThrow();
		});
		it('Should fail with unknown tokenID', async () => {
			const ctx = testing.createTransientModuleEndpointContext({
				stateStore,
				params: {
					tokenID: new TokenID(11).toBuffer(),
				},
			});

			await expect(endpoint.getTokenInfo(ctx)).rejects.toThrow();
		});

		it('Should getTokenInfo with correct TokenID', async () => {
			const ctx = testing.createTransientModuleEndpointContext({
				stateStore,
				params: {
					tokenID,
				},
			});

			const tokenInfo = await endpoint.getTokenInfo(ctx);

			expect(tokenInfo.name).toBe(testToken.name);
			expect(tokenInfo.symbol).toBe(testToken.symbol);
			expect(tokenInfo.totalSupply).toBe(testToken.totalSupply.toString());
			expect(tokenInfo.owner).toBe('kly75zmxzxe73s5sp45a8ggtcq8aeqg2k4rbkwuof');
		});
	});
});
