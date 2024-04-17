/* eslint-disable class-methods-use-this */

import {
	BaseCommand,
	CommandVerifyContext,
	CommandExecuteContext,
	VerificationResult,
	VerifyStatus,
	TokenMethod,
} from 'klayr-sdk';
import { mintSchema } from '../schemas';
import { OwnerStore } from '../stores/owner';
import { TokenID } from '../types';
import { TokenStore } from '../stores/token';
import { failWithLog } from '../utils';

export interface MintParams {
	tokenID: TokenID;
	amount: bigint;
	recipient: string;
}

export class MintCommand extends BaseCommand {
	private _minAmountToMint!: bigint;
	private _maxAmountToMint!: bigint;
	private _tokenMethod!: TokenMethod;

	public schema = mintSchema;

	public addDependencies(args: { tokenMethod: TokenMethod }) {
		this._tokenMethod = args.tokenMethod;
	}

	public async init(args: { minAmountToMint: bigint; maxAmountToMint: bigint }): Promise<void> {
		this._minAmountToMint = args.minAmountToMint;
		this._maxAmountToMint = args.maxAmountToMint;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(context: CommandVerifyContext<MintParams>): Promise<VerificationResult> {
		const { amount, tokenID } = context.params;
		const ownerStore = this.stores.get(OwnerStore);
		const owner = await ownerStore.get(context, tokenID);

		if (!owner.address.equals(context.transaction.senderAddress)) {
			return failWithLog<MintParams>(context, `Sender is not the token creator`);
		}

		if (amount > this._maxAmountToMint || amount < this._minAmountToMint) {
			return failWithLog<MintParams>(
				context,
				`Amount can not be lower than ${this._minAmountToMint} or greater than ${this._maxAmountToMint}`,
			);
		}

		return { status: VerifyStatus.OK };
	}

	public async execute(context: CommandExecuteContext<MintParams>): Promise<void> {
		context.logger.info('EXECUTE Mint');
		const { recipient, tokenID, amount } = context.params;
		const tokenStore = this.stores.get(TokenStore);

		await this._tokenMethod.mint(
			context.getMethodContext(),
			Buffer.from(recipient),
			Buffer.from(tokenID),
			BigInt(amount),
		);

		const token = await tokenStore.get(context, tokenID);
		token.totalSupply += BigInt(amount);
		await tokenStore.set(context, tokenID, token);
	}
}

// verifcation of the user in verify function
// Mint function itself in the execute
//
