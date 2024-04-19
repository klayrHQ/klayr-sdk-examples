/* eslint-disable class-methods-use-this */

import {
	BaseCommand,
	CommandVerifyContext,
	CommandExecuteContext,
	VerificationResult,
	VerifyStatus,
	TokenMethod,
} from 'klayr-sdk';
import { createTokenSchema } from '../schemas';
import { ModuleConfig } from '../types';
import { TokenStore } from '../stores/token';
import { CounterStore, CounterStoreData, counterKey } from '../stores/counter';
import { OwnerStore } from '../stores/owner';
import { NewTokenEvent } from '../events/new_token';

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
		const newTokenID = await this.getNextTokenIDAndSetStores(context, senderAddress);

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

	private async getNextTokenIDAndSetStores(
		context: CommandExecuteContext<CreateTokenParams>,
		senderAddress: Buffer,
	) {
		const tokenStore = this.stores.get(TokenStore);
		const counterStore = this.stores.get(CounterStore);
		const ownerStore = this.stores.get(OwnerStore);

		let tokenIdCounter: CounterStoreData = await counterStore
			.get(context, counterKey)
			.catch(() => ({ counter: 0 }));
		tokenIdCounter.counter++;

		const newLocalIDBuffer = Buffer.alloc(4);
		newLocalIDBuffer.writeUInt32BE(tokenIdCounter.counter);
		const newTokenIDBuffer = Buffer.concat([this._chainID, newLocalIDBuffer]);

		await Promise.all([
			counterStore.set(context, counterKey, tokenIdCounter),
			ownerStore.set(context, newTokenIDBuffer, { address: senderAddress }),
			tokenStore.set(context, newTokenIDBuffer, {
				name: context.params.name,
				symbol: context.params.symbol,
				totalSupply: BigInt(context.params.totalSupply),
			}),
		]);

		return newTokenIDBuffer;
	}
}
