import { MintCommand } from '@app/modules/token_factory/commands/mint_command';
import { TokenFactoryModule } from '@app/modules/token_factory/module';
import { mintSchema } from '@app/modules/token_factory/schemas';
import { createMintCtx, createSampleTransaction } from '@test/helpers';
import { Transaction, VerifyStatus, chain, codec, db } from 'lisk-sdk';
import { utils } from '@liskhq/lisk-cryptography';

describe.only('MintCommand', () => {
	const initConfig = {
		minAmountToMint: BigInt(1000),
		maxAmountToMint: BigInt(1e6) * BigInt(1e8),
	};
	const tokenID = Buffer.from('0000000100000000', 'hex');
	const mockMint = jest.fn();

	let command: MintCommand;
	let stateStore: any;

	beforeEach(async () => {
		const { minAmountToMint, maxAmountToMint } = initConfig;
		const tokenFactory = new TokenFactoryModule();

		command = new MintCommand(tokenFactory.stores, tokenFactory.events);
		command.addDependencies({ tokenMethod: { mint: mockMint } } as any);
		await command.init({ minAmountToMint, maxAmountToMint });
		stateStore = new chain.StateStore(new db.InMemoryDatabase());
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('mint');
		});

		it('should have valid schema', () => {
			expect(command.schema).toMatchSnapshot();
		});
	});

	describe('verify', () => {
		describe('schema validation', () => {
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

				const result = await command.verify(context);
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

				const result = await command.verify(context);
				expect(result.status).toBe(VerifyStatus.FAIL);
			});

			it('should throw when `amount` is too low', async () => {
				const recipient = utils.getRandomBytes(20);
				const paramWithInvalidamount = codec.encode(mintSchema, {
					tokenID,
					amount: BigInt(1000) + BigInt(1),
					recipient,
				});
				const transaction = new Transaction(
					createSampleTransaction(paramWithInvalidamount, MintCommand.name),
				);
				const context = createMintCtx(stateStore, transaction, 'verify');

				const result = await command.verify(context);
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
