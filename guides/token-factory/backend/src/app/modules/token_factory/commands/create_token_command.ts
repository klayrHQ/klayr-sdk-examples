/* eslint-disable class-methods-use-this */

import {
	BaseCommand,
	CommandVerifyContext,
	CommandExecuteContext,
	VerificationResult,
	VerifyStatus,
	TokenMethod,
} from 'lisk-sdk';
import { createTokenSchema } from '../schema';
import { ModuleConfig } from '../../types';

export interface CreateTokenParams {
	name: string;
	symbol: string;
	totalSupply: number;
}

export class CreateTokenCommand extends BaseCommand {
	private _maxTotalSupply!: number;
	private _tokenMethod!: TokenMethod;

	public schema = createTokenSchema;

	public addDependencies(args: { tokenMethod: TokenMethod }) {
		this._tokenMethod = args.tokenMethod;
	}

	public async init(config: ModuleConfig): Promise<void> {
		this._maxTotalSupply = config.maxTotalSupply;
		this.schema.properties.name.maxLength = config.maxNameLength;
		this.schema.properties.symbol.maxLength = config.maxSymbolLength;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: CommandVerifyContext<CreateTokenParams>,
	): Promise<VerificationResult> {
		context.logger.info('TX VERIFICATION');

		if (context.params.totalSupply > this._maxTotalSupply) {
			const error = Error(`Total supply cannot be greater than ${this._maxTotalSupply}`);
			context.logger.info(error);
			return {
				status: VerifyStatus.FAIL,
				error,
			};
		}

		return {
			status: VerifyStatus.OK,
		};
	}

	public async execute(context: CommandExecuteContext<CreateTokenParams>): Promise<void> {
		context.logger.info('EXECUTE');
		const {
			transaction: { senderAddress },
		} = context;
		await this._tokenMethod.mint(
			context.getMethodContext(),
			senderAddress,
			Buffer.from('0001', 'hex'),
			BigInt(1),
		);
	}
}
