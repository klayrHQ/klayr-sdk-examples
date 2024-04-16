/* eslint-disable class-methods-use-this */

import {
	BaseCommand,
	CommandVerifyContext,
	CommandExecuteContext,
	VerificationResult,
	VerifyStatus,
	TokenMethod,
} from 'lisk-sdk';
import { createTokenSchema } from '../schemas';
import { ModuleConfig } from '../types';
import { TokenStore } from '../stores/token';
import { CounterStore, CounterStoreData, counterKey } from '../stores/counter';
import { OwnerStore } from '../stores/owner';

export interface CreateTokenParams {
	name: string;
	symbol: string;
	totalSupply: bigint;
}

export class CreateTokenCommand extends BaseCommand {
	private _maxTotalSupply!: bigint;
	private _tokenMethod!: TokenMethod;
	private _chainID!: Buffer;

	public schema = createTokenSchema;

	public addDependencies(args: { tokenMethod: TokenMethod }) {
		this._tokenMethod = args.tokenMethod;
	}

	public async init(config: ModuleConfig): Promise<void> {
		this._maxTotalSupply = config.maxTotalSupply;
		this._chainID = config.chainID;
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
		context.logger.info('EXECUTE Create Token');
		const {
			transaction: { senderAddress },
		} = context;
		const tokenStore = this.stores.get(TokenStore);
		const counterStore = this.stores.get(CounterStore);
		const ownerStore = this.stores.get(OwnerStore);

		let tokenIdCounter: CounterStoreData = await counterStore
			.get(context, counterKey)
			.catch(() => ({ counter: BigInt(0) }));
		tokenIdCounter.counter += BigInt(1);

		const currentTokenID = tokenIdCounter.counter;
		const currentTokenIDBuff = Buffer.concat([
			this._chainID,
			// transform tokenID to hexadecimal with up to 8 leading zeros
			// to conform to the tokenID standard of Lisk
			Buffer.from(currentTokenID.toString(16).padStart(8, '0'), 'hex'),
		]);

		await Promise.all([
			counterStore.set(context, counterKey, tokenIdCounter),
			ownerStore.set(context, currentTokenIDBuff, { address: senderAddress }),
			tokenStore.set(context, currentTokenIDBuff, {
				tokenID: currentTokenID,
				name: context.params.name,
				symbol: context.params.symbol,
				totalSupply: BigInt(context.params.totalSupply),
			}),
		]);

		await this._tokenMethod.initializeToken(context.getMethodContext(), currentTokenIDBuff);
		await this._tokenMethod.mint(
			context.getMethodContext(),
			senderAddress,
			currentTokenIDBuff,
			BigInt(context.params.totalSupply),
		);

		// EVENT
	}
}
