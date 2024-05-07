/* eslint-disable class-methods-use-this */

import {
	BaseCommand,
	CommandVerifyContext,
	CommandExecuteContext,
	VerificationResult,
	VerifyStatus,
	TokenMethod,
	FeeMethod,
} from 'klayr-sdk';
import { createTokenSchema } from '../schemas';
import { ModuleConfig } from '../types';
import { NewTokenEvent } from '../events/new_token';
import { InternalMethod } from '../internal_methods';

export interface CreateTokenParams {
	name: string;
	symbol: string;
	totalSupply: bigint;
}

export class CreateTokenCommand extends BaseCommand {
	private _tokenMethod!: TokenMethod;
	private _feeMethod!: FeeMethod;
	private _maxTotalSupply!: bigint;
	private _chainID!: Buffer;
	private _createTokenFee!: bigint;
	private _internalMethod!: InternalMethod;

	public schema = createTokenSchema;

	public addDependencies(args: {
		internalMethod: InternalMethod;
		tokenMethod: TokenMethod;
		feeMethod: FeeMethod;
	}) {
		this._internalMethod = args.internalMethod;
		this._tokenMethod = args.tokenMethod;
		this._feeMethod = args.feeMethod;
	}

	public async init(config: ModuleConfig): Promise<void> {
		this._maxTotalSupply = config.maxTotalSupply;
		this._chainID = config.chainID;
		this._createTokenFee = config.createTokenFee;
		this.schema.properties.name.maxLength = config.maxNameLength;
		this.schema.properties.symbol.maxLength = config.maxSymbolLength;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: CommandVerifyContext<CreateTokenParams>,
	): Promise<VerificationResult> {
		const { logger, params, transaction } = context;

		logger.info('TX VERIFICATION');
		if (params.totalSupply > this._maxTotalSupply) {
			const error = Error(`Total supply cannot be greater than ${this._maxTotalSupply}`);
			logger.info(error);
			return {
				status: VerifyStatus.FAIL,
				error,
			};
		}

		if (transaction.fee < this._createTokenFee) {
			return {
				status: VerifyStatus.FAIL,
				error: new Error('Insufficient transaction fee'),
			};
		}

		return {
			status: VerifyStatus.OK,
		};
	}

	public async execute(context: CommandExecuteContext<CreateTokenParams>): Promise<void> {
		context.logger.info('EXECUTE Create Token');
		const {
			transaction: { senderAddress },
		} = context;
		const newTokenID = await this._internalMethod.getNextTokenIDAndSetStores(
			context,
			senderAddress,
		);

		this._feeMethod.payFee(context.getMethodContext(), this._createTokenFee);

		await this._tokenMethod.initializeToken(context.getMethodContext(), newTokenID);
		await this._tokenMethod.mint(
			context.getMethodContext(),
			senderAddress,
			newTokenID,
			BigInt(context.params.totalSupply),
		);

		const newTokenEvent = this.events.get(NewTokenEvent);
		newTokenEvent.add(
			context,
			{
				owner: senderAddress,
				tokenID: newTokenID,
				name: context.params.name,
				symbol: context.params.symbol,
				totalSupply: BigInt(context.params.totalSupply),
			},
			[newTokenID],
		);
	}
}
