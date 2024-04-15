import { MintCommand } from '@app/modules/token_factory/commands/mint_command';
import { TokenFactoryModule } from '@app/modules/token_factory/module';
import { createTokenSchema, mintSchema } from '@app/modules/token_factory/schemas';
import { createCreateTokenCtx, createMintCtx, createSampleTransaction } from '@test/helpers';
import { CommandExecuteContext, Transaction, VerifyStatus, chain, codec, db } from 'lisk-sdk';
import { utils } from '@liskhq/lisk-cryptography';
import {
	CreateTokenCommand,
	CreateTokenParams,
} from '@app/modules/token_factory/commands/create_token_command';
import { ModuleConfig } from '@app/modules/token_factory/types';

describe.only('MintCommand', () => {
	const initConfig = {
		minAmountToMint: BigInt(1000),
		maxAmountToMint: BigInt(1e6) * BigInt(1e8),
	};
	const defaultToken = {
		name: 'The real pepe coin',
		symbol: 'PEPE',
		totalSupply: BigInt(1e4),
	};
	const tokenID = Buffer.alloc(8);
	tokenID.writeBigUInt64BE(BigInt(1));
	const mockMint = jest.fn();

	let mintCommand: MintCommand;
	let createCommand: CreateTokenCommand;
	let stateStore: any;

	beforeEach(async () => {
		const { minAmountToMint, maxAmountToMint } = initConfig;
		const tokenFactory = new TokenFactoryModule();

		mintCommand = new MintCommand(tokenFactory.stores, tokenFactory.events);
		mintCommand.addDependencies({ tokenMethod: { mint: mockMint } } as any);
		await mintCommand.init({ minAmountToMint, maxAmountToMint });

		createCommand = new CreateTokenCommand(tokenFactory.stores, tokenFactory.events);
		createCommand.addDependencies({ tokenMethod: { mint: mockMint } } as any);
		await createCommand.init(initConfig as ModuleConfig);

		stateStore = new chain.StateStore(new db.InMemoryDatabase());
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
				const defaultValidParams = codec.encode(createTokenSchema, defaultToken);
				const transaction = new Transaction(
					createSampleTransaction(defaultValidParams, CreateTokenCommand.name),
				);
				const context = createCreateTokenCtx(stateStore, transaction, 'execute');

				await expect(
					createCommand.execute(context as CommandExecuteContext<CreateTokenParams>),
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
				const context = createMintCtx(stateStore, transaction, 'verify');

				const result = await mintCommand.verify(context);
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
				const context = createMintCtx(stateStore, transaction, 'verify');

				const result = await mintCommand.verify(context);
				expect(result.status).toBe(VerifyStatus.FAIL);
			});

			it('should be OK when params are correct', async () => {
				const recipient = utils.getRandomBytes(20);
				const validParams = codec.encode(mintSchema, {
					tokenID,
					amount: BigInt(1000) + BigInt(1),
					recipient,
				});
				const transaction = new Transaction(createSampleTransaction(validParams, MintCommand.name));
				const context = createMintCtx(stateStore, transaction, 'verify');

				const result = await mintCommand.verify(context);
				expect(result.status).toBe(VerifyStatus.OK);
			});
		});
	});

	describe('execute', () => {
		describe('valid cases', () => {
			it.todo('should update the state store');
		});

		describe('invalid cases', () => {
			it.todo('should throw error');
		});
	});
});
