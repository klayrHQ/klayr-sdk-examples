/* eslint-disable */

import { BurnCommand, BurnParams } from '@app/modules/token_factory/commands/burn_command';
import {
	CreateTokenCommand,
	CreateTokenParams,
} from '@app/modules/token_factory/commands/create_token_command';
import { InternalMethod } from '@app/modules/token_factory/internal_methods';
import { TokenFactoryMethod } from '@app/modules/token_factory/method';
import { TokenFactoryModule } from '@app/modules/token_factory/module';
import { burnSchema, createTokenSchema as createSchema } from '@app/modules/token_factory/schemas';
import { TokenStore } from '@app/modules/token_factory/stores/token';
import { ModuleConfig } from '@app/modules/token_factory/types';
import { TokenID, createCtx, createSampleTransaction } from '@test/helpers';
import { CommandExecuteContext, Transaction, VerifyStatus, chain, codec, db } from 'klayr-sdk';

describe('BurnCommand', () => {
	const initConfig = {
		minAmountToBurn: BigInt(1000),
		chainID: Buffer.from('01234567'),
	};
	const tokenID = new TokenID(1).toBuffer();

	let burnCommand: BurnCommand;
	let createCommand: CreateTokenCommand;
	let stateStore: any;
	let tokenStore: TokenStore;

	const mockMint = jest.fn();
	const mockInitialize = jest.fn();
	const mockBurn = jest.fn();
	const getAvailableBalance = jest.fn();
	const mockPayFee = jest.fn();

	beforeEach(async () => {
		const { minAmountToBurn } = initConfig;
		const tokenFactory = new TokenFactoryModule();
		const tokenFactoryMethod = new TokenFactoryMethod(tokenFactory.stores, tokenFactory.events);
		const internalMethod = new InternalMethod(tokenFactory.stores, tokenFactory.events);
		await internalMethod.init(initConfig.chainID);

		burnCommand = new BurnCommand(tokenFactory.stores, tokenFactory.events);
		burnCommand.addDependencies({
			tokenFactoryMethod,
			tokenMethod: { burn: mockBurn, getAvailableBalance } as any,
		});
		await burnCommand.init({ minAmountToBurn });

		createCommand = new CreateTokenCommand(tokenFactory.stores, tokenFactory.events);
		createCommand.addDependencies({
			internalMethod,
			tokenMethod: { mint: mockMint, initializeToken: mockInitialize },
			feeMethod: { payFee: mockPayFee },
		} as any);
		await createCommand.init(initConfig as ModuleConfig);

		stateStore = new chain.StateStore(new db.InMemoryDatabase());
		tokenStore = tokenFactory.stores.get(TokenStore);
		getAvailableBalance.mockResolvedValue(BigInt(1e4) * BigInt(1e8));
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(burnCommand.name).toEqual('burn');
		});

		it('should have valid schema', () => {
			expect(burnCommand.schema).toMatchSnapshot();
		});
	});

	describe('verify', () => {
		describe('schema validation', () => {
			beforeEach(async () => {
				const defaultToken = {
					name: 'The real pepe coin',
					symbol: 'PEPE',
					totalSupply: BigInt(1e4) * BigInt(1e8),
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

			it('should throw when `amount` is higher than balance of sender', async () => {
				const paramWithInvalidamount = codec.encode(burnSchema, {
					tokenID,
					amount: BigInt(1e4) * BigInt(1e8) + BigInt(1),
				});
				const transaction = new Transaction(
					createSampleTransaction(paramWithInvalidamount, BurnCommand.name),
				);
				const ctx = createCtx<BurnParams>(stateStore, transaction, burnSchema, 'verify');

				const result = await burnCommand.verify(ctx);
				expect(result.status).toBe(VerifyStatus.FAIL);
				expect(result.error).toEqual(
					new Error(
						`Amount can not be lower than ${initConfig.minAmountToBurn} or greater than balance`,
					),
				);
			});

			it('should throw when `amount` is too low', async () => {
				const paramWithInvalidamount = codec.encode(burnSchema, {
					tokenID,
					amount: initConfig.minAmountToBurn - BigInt(1),
				});
				const transaction = new Transaction(
					createSampleTransaction(paramWithInvalidamount, BurnCommand.name),
				);
				const ctx = createCtx<BurnParams>(stateStore, transaction, burnSchema, 'verify');

				const result = await burnCommand.verify(ctx);
				expect(result.status).toBe(VerifyStatus.FAIL);
				expect(result.error).toEqual(
					new Error('Amount can not be lower than 1000 or greater than balance'),
				);
			});

			it('should throw when sender is not the token owner / creator', async () => {
				const differentSender = 'ce2e1c458bb616e2717aa48f7392b39b1bc01af7297755db7b6d1db605fa0ef7';
				const validParams = codec.encode(burnSchema, {
					tokenID,
					amount: BigInt(1000) + BigInt(1),
				});
				const transaction = new Transaction(
					createSampleTransaction(validParams, BurnCommand.name, differentSender),
				);
				const ctx = createCtx<BurnParams>(stateStore, transaction, burnSchema, 'verify');

				const result = await burnCommand.verify(ctx);

				expect(result.status).toBe(VerifyStatus.FAIL);
				expect(result.error).toEqual(new Error('Sender is not the token creator'));
			});

			it('should throw correct error when tokenID is invalid', async () => {
				const invalidTokenID = new TokenID(2).toBuffer();
				const paramsWithInvalidTokenID = codec.encode(burnSchema, {
					tokenID: invalidTokenID,
					amount: BigInt(1000) + BigInt(1),
				});
				const transaction = new Transaction(
					createSampleTransaction(paramsWithInvalidTokenID, BurnCommand.name),
				);
				const ctx = createCtx<BurnParams>(stateStore, transaction, burnSchema, 'verify');

				const result = await burnCommand.verify(ctx);

				expect(result.status).toBe(VerifyStatus.FAIL);
				expect(result.error).toEqual(new Error(`Invalid tokenID: ${invalidTokenID}`));
			});

			it('should be OK when params are correct', async () => {
				const validParams = codec.encode(burnSchema, {
					tokenID,
					amount: BigInt(1e2) * BigInt(1e8),
				});
				const transaction = new Transaction(createSampleTransaction(validParams, BurnCommand.name));
				const ctx = createCtx<BurnParams>(stateStore, transaction, burnSchema, 'verify');

				const result = await burnCommand.verify(ctx);
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
					totalSupply: BigInt(1e4) * BigInt(1e8),
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

			it('burn function should have been called and updated `totalSupply` ', async () => {
				const validParams = codec.encode(burnSchema, {
					tokenID,
					amount: BigInt(1e2) * BigInt(1e8),
				});

				const transaction = new Transaction(createSampleTransaction(validParams, BurnCommand.name));
				const ctx = createCtx<BurnParams>(stateStore, transaction, burnSchema, 'execute');

				await expect(
					burnCommand.execute(ctx as CommandExecuteContext<BurnParams>),
				).resolves.toBeUndefined();

				const token = await tokenStore.get(ctx, tokenID);

				// initial supply - burned amount
				expect(token.totalSupply).toBe(BigInt(1e4) * BigInt(1e8) - BigInt(1e2) * BigInt(1e8));
				expect(mockBurn).toHaveBeenCalledTimes(1);
			});
		});

		describe('invalid cases', () => {
			it.todo('should throw error');
		});
	});
});
