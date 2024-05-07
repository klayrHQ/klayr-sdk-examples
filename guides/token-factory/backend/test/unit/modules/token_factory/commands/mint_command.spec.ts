import { MintCommand, MintParams } from '@app/modules/token_factory/commands/mint_command';
import { TokenFactoryModule } from '@app/modules/token_factory/module';
import { createTokenSchema as createSchema, mintSchema } from '@app/modules/token_factory/schemas';
import { TokenID, createCtx, createSampleTransaction } from '@test/helpers';
import { CommandExecuteContext, Transaction, VerifyStatus, chain, codec, db } from 'klayr-sdk';
import { utils } from '@klayr/cryptography';
import {
	CreateTokenCommand,
	CreateTokenParams,
} from '@app/modules/token_factory/commands/create_token_command';
import { ModuleConfig } from '@app/modules/token_factory/types';
import { TokenStore } from '@app/modules/token_factory/stores/token';
import { TokenFactoryMethod } from '@app/modules/token_factory/method';
import { InternalMethod } from '@app/modules/token_factory/internal_methods';

describe('MintCommand', () => {
	const initConfig = {
		minAmountToMint: BigInt(1000),
		maxAmountToMint: BigInt(1e6) * BigInt(1e8),
		chainID: Buffer.from('12345678'),
		createTokenFee: BigInt(100_000),
	};
	const tokenID = new TokenID(1).toBuffer();
	const recipient = utils.getRandomBytes(20);

	const defaultValidParams = codec.encode(mintSchema, {
		tokenID,
		amount: BigInt(1000) * BigInt(1e8),
		recipient,
	});

	const mockMint = jest.fn();
	const mockInitialize = jest.fn();
	const mockPayFee = jest.fn();

	let mintCommand: MintCommand;
	let createCommand: CreateTokenCommand;
	let stateStore: any;
	let tokenStore: TokenStore;

	beforeEach(async () => {
		const { minAmountToMint, maxAmountToMint } = initConfig;
		const tokenFactory = new TokenFactoryModule();
		const tokenFactoryMethod = new TokenFactoryMethod(tokenFactory.stores, tokenFactory.events);
		const internalMethod = new InternalMethod(tokenFactory.stores, tokenFactory.events);
		await internalMethod.init(initConfig.chainID);

		mintCommand = new MintCommand(tokenFactory.stores, tokenFactory.events);
		mintCommand.addDependencies({ tokenFactoryMethod, tokenMethod: { mint: mockMint } as any });
		await mintCommand.init({ minAmountToMint, maxAmountToMint });

		createCommand = new CreateTokenCommand(tokenFactory.stores, tokenFactory.events);
		createCommand.addDependencies({
			internalMethod,
			tokenMethod: { mint: mockMint, initializeToken: mockInitialize },
			feeMethod: { payFee: mockPayFee },
		} as any);
		await createCommand.init(initConfig as ModuleConfig);

		stateStore = new chain.StateStore(new db.InMemoryDatabase());
		tokenStore = tokenFactory.stores.get(TokenStore);
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(mintCommand.name).toEqual('mint');
		});

		it('should have valid schema', () => {
			expect(mintCommand.schema).toMatchSnapshot();
		});
	});

	describe('verify', () => {
		describe('schema validation', () => {
			beforeEach(async () => {
				const defaultToken = {
					name: 'The real pepe coin',
					symbol: 'PEPE',
					totalSupply: BigInt(1e4),
				};
				const defaultValidParams = codec.encode(createSchema, defaultToken);
				const transaction = new Transaction(
					createSampleTransaction(defaultValidParams, CreateTokenCommand.name),
				);
				const ctx = createCtx<CreateTokenParams>(stateStore, transaction, createSchema, 'execute');

				await expect(
					createCommand.execute(ctx as CommandExecuteContext<CreateTokenParams>),
				).resolves.toBeUndefined();
			});

			it('should throw when `amount` is too high', async () => {
				const recipient = utils.getRandomBytes(20);
				const paramWithInvalidamount = codec.encode(mintSchema, {
					tokenID,
					amount: BigInt(1e6) * BigInt(1e8) + BigInt(1),
					recipient,
				});
				const transaction = new Transaction(
					createSampleTransaction(paramWithInvalidamount, MintCommand.name),
				);
				const ctx = createCtx<MintParams>(stateStore, transaction, mintSchema, 'verify');

				const result = await mintCommand.verify(ctx);
				expect(result.status).toBe(VerifyStatus.FAIL);
			});

			it('should throw when `amount` is too low', async () => {
				const recipient = utils.getRandomBytes(20);
				const paramWithInvalidamount = codec.encode(mintSchema, {
					tokenID,
					amount: BigInt(1000) - BigInt(1),
					recipient,
				});
				const transaction = new Transaction(
					createSampleTransaction(paramWithInvalidamount, MintCommand.name),
				);
				const ctx = createCtx<MintParams>(stateStore, transaction, mintSchema, 'verify');

				const result = await mintCommand.verify(ctx);
				expect(result.status).toBe(VerifyStatus.FAIL);
			});

			it('should throw when sender is not the token owner / creator', async () => {
				const recipient = utils.getRandomBytes(21);
				const differentSender = 'ce2e1c458bb616e2717aa48f7392b39b1bc01af7297755db7b6d1db605fa0ef7';
				const validParams = codec.encode(mintSchema, {
					tokenID,
					amount: BigInt(1000) + BigInt(1),
					recipient,
				});
				const transaction = new Transaction(
					createSampleTransaction(validParams, MintCommand.name, differentSender),
				);
				const ctx = createCtx<MintParams>(stateStore, transaction, mintSchema, 'verify');

				const result = await mintCommand.verify(ctx);

				expect(result.status).toBe(VerifyStatus.FAIL);
				expect(result.error).toEqual(new Error('Sender is not the token creator'));
			});

			it('should throw correct error when tokenID is invalid', async () => {
				const recipient = utils.getRandomBytes(20);
				const invalidTokenID = new TokenID(20).toBuffer();
				const paramsWithInvalidTokenID = codec.encode(mintSchema, {
					tokenID: invalidTokenID,
					amount: BigInt(1000) + BigInt(1),
					recipient,
				});
				const transaction = new Transaction(
					createSampleTransaction(paramsWithInvalidTokenID, MintCommand.name),
				);
				const ctx = createCtx<MintParams>(stateStore, transaction, mintSchema, 'verify');

				const result = await mintCommand.verify(ctx);

				expect(result.status).toBe(VerifyStatus.FAIL);
				expect(result.error).toEqual(new Error(`Invalid tokenID: ${invalidTokenID}`));
			});

			it('should be OK when params are correct', async () => {
				const transaction = new Transaction(
					createSampleTransaction(defaultValidParams, MintCommand.name),
				);
				const ctx = createCtx<MintParams>(stateStore, transaction, mintSchema, 'verify');

				const result = await mintCommand.verify(ctx);
				expect(result.status).toBe(VerifyStatus.OK);
			});
		});
	});

	describe('execute', () => {
		describe('valid cases', () => {
			beforeEach(async () => {
				const defaultToken = {
					name: 'The real pepe coin',
					symbol: 'PEPE',
					totalSupply: BigInt(1e4),
				};
				const defaultValidParams = codec.encode(createSchema, defaultToken);
				const transaction = new Transaction(
					createSampleTransaction(defaultValidParams, CreateTokenCommand.name),
				);
				const ctx = createCtx<CreateTokenParams>(stateStore, transaction, createSchema, 'execute');

				await expect(
					createCommand.execute(ctx as CommandExecuteContext<CreateTokenParams>),
				).resolves.toBeUndefined();
			});

			it('mint function should have been called and updated `totalSupply` ', async () => {
				const transaction = new Transaction(
					createSampleTransaction(defaultValidParams, MintCommand.name),
				);
				const ctx = createCtx<MintParams>(stateStore, transaction, mintSchema, 'execute');

				await expect(
					mintCommand.execute(ctx as CommandExecuteContext<MintParams>),
				).resolves.toBeUndefined();

				const token = await tokenStore.get(ctx, tokenID);

				// initial supply + minted amount
				expect(token.totalSupply).toBe(BigInt(1e4) + BigInt(1000) * BigInt(1e8));
				expect(mockMint).toHaveBeenCalledTimes(2);
			});
		});

		describe('invalid cases', () => {
			it.todo('should throw error');
		});
	});
});
