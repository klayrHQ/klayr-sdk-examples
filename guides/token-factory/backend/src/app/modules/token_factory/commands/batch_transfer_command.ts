/* eslint-disable */
import {
	BaseCommand,
	CommandVerifyContext,
	CommandExecuteContext,
	VerificationResult,
	VerifyStatus,
	TokenMethod,
} from 'klayr-sdk';
import { TokenID } from '../types';
import { batchTransferParamsSchema } from '../schemas';
import { failWithLog } from '../utils';

export interface Params {
	tokenID: TokenID;
	amounts: bigint[];
	recipients: Buffer[];
}

export class BatchTransferCommand extends BaseCommand {
	// @ts-ignore
	private _tokenMethod!: TokenMethod;

	public schema = batchTransferParamsSchema;

	public addDependencies(args: { tokenMethod: TokenMethod }) {
		this._tokenMethod = args.tokenMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(context: CommandVerifyContext<Params>): Promise<VerificationResult> {
		const {
			params: { tokenID, amounts, recipients },
		} = context;

		const availableBalance = await this._tokenMethod.getAvailableBalance(
			context.getMethodContext(),
			context.transaction.senderAddress,
			tokenID,
		);
		const totalAmount = amounts.reduce((a, b) => a + b, BigInt(0));

		if (amounts.length !== recipients.length) {
			return failWithLog<Params>(context, `Amounts and Recipients arrays not the same length`);
		}

		if (availableBalance < totalAmount) {
			return failWithLog<Params>(context, `Insufficient Balance`);
		}

		return { status: VerifyStatus.OK };
	}

	public async execute(context: CommandExecuteContext<Params>): Promise<void> {
		const { params } = context;

		for (const [i, recipientAddress] of params.recipients.entries()) {
			await this._tokenMethod.transfer(
				context.getMethodContext(),
				context.transaction.senderAddress,
				recipientAddress,
				params.tokenID,
				params.amounts[i],
			);
		}
	}
}
