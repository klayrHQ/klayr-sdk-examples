/* eslint-disable */
import {
	BaseCommand,
	CommandVerifyContext,
	CommandExecuteContext,
	VerificationResult,
	VerifyStatus,
	TokenMethod,
} from 'klayr-sdk';
import { burnSchema } from '../schemas';
import { failWithLog } from '../utils';
import { OwnerStore } from '../stores/owner';
import { TokenID } from '../types';

export interface BurnParams {
	tokenID: TokenID;
	amount: bigint;
}

export class BurnCommand extends BaseCommand {
	private _minAmountToBurn!: bigint;
	private _tokenMethod!: TokenMethod;
	public schema = burnSchema;

	public addDependencies(args: { tokenMethod: TokenMethod }) {
		this._tokenMethod = args.tokenMethod;
	}

	public async init(args: { minAmountToBurn: bigint }): Promise<void> {
		this._minAmountToBurn = args.minAmountToBurn;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(context: CommandVerifyContext<BurnParams>): Promise<VerificationResult> {
		const { tokenID, amount } = context.params;

		const availabeBalance = await this._tokenMethod.getAvailableBalance(
			context,
			context.transaction.senderAddress,
			tokenID,
		);

		if (amount < this._minAmountToBurn || amount > availabeBalance) {
			return failWithLog<BurnParams>(
				context,
				`Amount can not be lower than ${this._minAmountToBurn} or greater than balance`,
			);
		}

		try {
			const ownerStore = this.stores.get(OwnerStore);
			const owner = await ownerStore.get(context, tokenID);

			if (!owner.address.equals(context.transaction.senderAddress)) {
				return failWithLog<BurnParams>(context, `Sender is not the token creator`);
			}
		} catch {
			return failWithLog<BurnParams>(context, `Invalid tokenID: ${tokenID}`);
		}

		return { status: VerifyStatus.OK };
	}

	public async execute(_context: CommandExecuteContext<BurnParams>): Promise<void> {}
}
