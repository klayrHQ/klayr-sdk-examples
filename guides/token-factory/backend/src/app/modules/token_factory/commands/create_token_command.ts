/* eslint-disable class-methods-use-this */

import {
	BaseCommand,
	CommandVerifyContext,
	CommandExecuteContext,
	VerificationResult,
	VerifyStatus,
} from 'lisk-sdk';
import { createTokenSchema } from '../schema';
import { ModuleConfig } from '../../types';

export interface CreateTokenParams {
	name: string;
	symbol: string;
	totalSupply: number;
}

export class CreateTokenCommand extends BaseCommand {
	public schema = createTokenSchema;
	private maxTotalSupply!: number;

	public async init(config: ModuleConfig): Promise<void> {
		this.maxTotalSupply = config.maxTotalSupply;
		this.schema.properties.name.maxLength = config.maxNameLength;
		this.schema.properties.symbol.maxLength = config.maxSymbolLength;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: CommandVerifyContext<CreateTokenParams>,
	): Promise<VerificationResult> {
		context.logger.info('TX VERIFICATION');

		if (context.params.totalSupply > this.maxTotalSupply) {
			const error = Error(`Total supply cannot be greater than ${this.maxTotalSupply}`);
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
	}
}
