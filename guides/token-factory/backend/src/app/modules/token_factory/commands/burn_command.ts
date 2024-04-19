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
import { OwnerStore, OwnerStoreData } from '../stores/owner';
import { TokenID } from '../types';
import { TokenStore } from '../stores/token';

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

		const isAmountValid = await this.isAmountValid(context, amount, tokenID);
		if (!isAmountValid) {
			return failWithLog<BurnParams>(
				context,
				`Amount can not be lower than ${this._minAmountToBurn} or greater than balance`,
			);
		}

		const owner = await this.getOwnerOfToken(context, tokenID);
		if (!owner) {
			return failWithLog<BurnParams>(context, `Invalid tokenID: ${tokenID}`);
		}

		if (!owner.address.equals(context.transaction.senderAddress)) {
			return failWithLog<BurnParams>(context, `Sender is not the token creator`);
		}

		return { status: VerifyStatus.OK };
	}

	public async execute(context: CommandExecuteContext<BurnParams>): Promise<void> {
		const { tokenID, amount } = context.params;
		const tokenStore = this.stores.get(TokenStore);

		await this._tokenMethod.burn(
			context.getMethodContext(),
			context.transaction.senderAddress,
			Buffer.from(tokenID),
			BigInt(amount),
		);

		const token = await tokenStore.get(context, tokenID);
		token.totalSupply -= BigInt(amount);
		await tokenStore.set(context, tokenID, token);
	}

	private async isAmountValid(
		context: CommandVerifyContext<BurnParams>,
		amount: bigint,
		tokenID: Buffer,
	): Promise<boolean> {
		const availabeBalance = await this._tokenMethod.getAvailableBalance(
			context,
			context.transaction.senderAddress,
			tokenID,
		);

		return amount >= this._minAmountToBurn && amount <= availabeBalance;
	}

	private async getOwnerOfToken(
		context: CommandVerifyContext<BurnParams>,
		tokenID: Buffer,
	): Promise<OwnerStoreData | undefined> {
		try {
			const ownerStore = this.stores.get(OwnerStore);
			return await ownerStore.get(context, tokenID);
		} catch {
			return undefined;
		}
	}
}
