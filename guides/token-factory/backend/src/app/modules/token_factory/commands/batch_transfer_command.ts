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
	recipients: {
		recipient: Buffer;
		amount: bigint;
	}[];
}

export class BatchTransferCommand extends BaseCommand {
	private _tokenMethod!: TokenMethod;

	public schema = batchTransferParamsSchema;

	public addDependencies(args: { tokenMethod: TokenMethod }) {
		this._tokenMethod = args.tokenMethod;
	}

	public async verify(context: CommandVerifyContext<Params>): Promise<VerificationResult> {
		const {
			params: { tokenID, recipients },
		} = context;

		const availableBalance = await this._tokenMethod.getAvailableBalance(
			context.getMethodContext(),
			context.transaction.senderAddress,
			tokenID,
		);

		const totalAmount = recipients.reduce(
			(total, recipient) => total + recipient.amount,
			BigInt(0),
		);

		if (availableBalance < totalAmount) {
			return failWithLog<Params>(context, `Insufficient Balance`);
		}

		return { status: VerifyStatus.OK };
	}

	public async execute(context: CommandExecuteContext<Params>): Promise<void> {
		const {
			params: { tokenID, recipients },
		} = context;

		for (const recipient of recipients) {
			await this._tokenMethod.transfer(
				context.getMethodContext(),
				context.transaction.senderAddress,
				recipient.recipient,
				tokenID,
				recipient.amount,
			);
		}
	}
}
