/* eslint-disable class-methods-use-this */

import {
	BaseCommand,
	CommandVerifyContext,
	CommandExecuteContext,
	VerificationResult,
	VerifyStatus,
	TokenMethod,
} from 'lisk-sdk';
import { mintSchema } from '../schemas';
import { TokenID } from '@app/modules/types';

export interface MintParams {
	tokenID: TokenID;
	amount: bigint;
	recipient: string;
}

export class MintCommand extends BaseCommand {
	// @ts-ignore
	private _minAmountToMint!: bigint;
	// @ts-ignore
	private _maxAmountToMint!: bigint;
	// @ts-ignore
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
		const amount = context.params.amount;
		if (amount > this._maxAmountToMint || amount < this._minAmountToMint) {
			const error = Error(
				`Amount can not be lower than ${this._minAmountToMint} or greater than ${this._maxAmountToMint}`,
			);
			context.logger.info(error);
			return {
				status: VerifyStatus.FAIL,
				error,
			};
		}

		return { status: VerifyStatus.OK };
	}

	public async execute(_context: CommandExecuteContext<MintParams>): Promise<void> {}
}
