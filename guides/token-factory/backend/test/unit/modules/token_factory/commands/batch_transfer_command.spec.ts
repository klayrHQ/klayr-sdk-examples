/* eslint-disable */

import {
	BatchTransferCommand,
	Params,
} from '@app/modules/token_factory/commands/batch_transfer_command';
import { TokenFactoryModule } from '@app/modules/token_factory/module';
import { batchTransferParamsSchema as schema } from '@app/modules/token_factory/schemas';
import {
	TokenID,
	createBatchTransferParams,
	createCtx,
	createSampleTransaction,
} from '@test/helpers';
import { CommandExecuteContext, Transaction, VerifyStatus, chain, codec, db } from 'klayr-sdk';

describe('BatchTransferCommand', () => {
	const tokenID = new TokenID(0).toBuffer();

	let batchTransfer: BatchTransferCommand;
	let stateStore: any;

	const getAvailableBalance = jest.fn();
	const mockTransfer = jest.fn();

	beforeEach(() => {
		const tokenFactory = new TokenFactoryModule();

		batchTransfer = new BatchTransferCommand(tokenFactory.stores, tokenFactory.events);
		batchTransfer.addDependencies({
			tokenMethod: { getAvailableBalance, transfer: mockTransfer } as any,
		});

		stateStore = new chain.StateStore(new db.InMemoryDatabase());

		// mock available balance in the sender wallet
		getAvailableBalance.mockResolvedValue(BigInt(1e14));
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(batchTransfer.name).toEqual('batchTransfer');
		});

		it('should have valid schema', () => {
			expect(batchTransfer.schema).toMatchSnapshot();
		});
	});

	describe('verify', () => {
		describe('schema validation', () => {
			it('should throw errors for insufficient balance', async () => {
				const numberOfTransfers = 1000;
				const { amounts, recipients } = createBatchTransferParams(numberOfTransfers);

				// invalid amount cause of too many transfers
				const paramWithInvalidAmount = codec.encode(schema, {
					tokenID: tokenID,
					amounts,
					recipients,
				});

				const transaction = new Transaction(
					createSampleTransaction(paramWithInvalidAmount, batchTransfer.name),
				);
				const ctx = createCtx<Params>(stateStore, transaction, schema, 'verify');

				const result = await batchTransfer.verify(ctx);
				expect(result.status).toBe(VerifyStatus.FAIL);
				expect(result.error).toEqual(new Error(`Insufficient Balance`));
			});

			it('should throw error when `amounts` and `recipients` are not the same length', async () => {
				const numberOfTransfers = 1000;
				const { amounts, recipients } = createBatchTransferParams(numberOfTransfers);
				amounts.push(BigInt(1e4));

				// invalid amount cause of too many transfers
				const paramWithInvalidAmount = codec.encode(schema, {
					tokenID: tokenID,
					amounts,
					recipients,
				});

				const transaction = new Transaction(
					createSampleTransaction(paramWithInvalidAmount, batchTransfer.name),
				);
				const ctx = createCtx<Params>(stateStore, transaction, schema, 'verify');

				const result = await batchTransfer.verify(ctx);
				expect(result.status).toBe(VerifyStatus.FAIL);
				expect(result.error).toEqual(
					new Error(`Amounts and Recipients arrays not the same length`),
				);
			});

			it('should be ok for valid schema', async () => {
				const numberOfTransfers = 50;
				const { amounts, recipients } = createBatchTransferParams(numberOfTransfers);

				const paramWithInvalidAmount = codec.encode(schema, {
					tokenID: tokenID,
					amounts,
					recipients,
				});

				const transaction = new Transaction(
					createSampleTransaction(paramWithInvalidAmount, batchTransfer.name),
				);
				const ctx = createCtx<Params>(stateStore, transaction, schema, 'verify');

				const result = await batchTransfer.verify(ctx);
				expect(result.status).toBe(VerifyStatus.OK);
			});
		});
	});

	describe('execute', () => {
		describe('valid cases', () => {
			it('should execute transfers', async () => {
				const numberOfTransfers = 10;
				const { amounts, recipients } = createBatchTransferParams(numberOfTransfers);

				const paramWithInvalidAmount = codec.encode(schema, {
					tokenID,
					amounts,
					recipients,
				});

				const transaction = new Transaction(
					createSampleTransaction(paramWithInvalidAmount, batchTransfer.name),
				);
				const ctx = createCtx<Params>(stateStore, transaction, schema, 'execute');
				await expect(
					batchTransfer.execute(ctx as CommandExecuteContext<Params>),
				).resolves.toBeUndefined();
				expect(mockTransfer).toHaveBeenCalledTimes(numberOfTransfers);
			});
		});

		describe('invalid cases', () => {
			it.todo('should throw error');
		});
	});
});
