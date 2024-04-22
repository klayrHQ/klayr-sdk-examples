/* eslint-disable */
import { BasePlugin, codec, db as klayrDB } from 'klayr-sdk';
import { configSchema, mintEventSchema } from './schemas';
import {
	getDBInstance,
	getLastEventHeight,
	getSingleEventTokenInfo,
	setEventNewTokenInfo,
	setLastEventHeight,
	setLastTokenID,
	setSingleEventTokenInfo,
} from './db';
import { ApiEventResult, Height, TokenFactoryInfoPluginConfig } from './types';
import { Endpoint } from './endpoint';
import {
	NewTokenEventData,
	newTokenDataSchema,
} from '../../../app/modules/token_factory/events/new_token';

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class TokenFactoryInfoPlugin extends BasePlugin<TokenFactoryInfoPluginConfig> {
	public configSchema = configSchema;
	public endpoint = new Endpoint();
	private _pluginDB!: klayrDB.Database;

	private async _getLastHeight(): Promise<Height> {
		try {
			const height = await getLastEventHeight(this._pluginDB);
			return height;
		} catch (error) {
			if (!(error instanceof klayrDB.NotFoundError)) {
				throw error;
			}
			await setLastEventHeight(this._pluginDB, 0);
			return { height: 0 };
		}
	}

	private async _syncChainEvents(): Promise<void> {
		// 1. Get the latest block height from the blockchain
		const res = await this.apiClient.invoke<{ header: { height: number } }>(
			'chain_getLastBlock',
			{},
		);
		// 2. Get block height stored in the database
		const heightObj = await this._getLastHeight();
		const lastStoredHeight = heightObj.height + 1;
		const { height } = res.header;

		// 3. Loop through new blocks, starting from the lastStoredHeight + 1
		for (let index = lastStoredHeight; index <= height; index += 1) {
			const result = await this.apiClient.invoke<ApiEventResult[]>('chain_getEvents', {
				height: index,
			});

			const newTokenEvents = result.filter(
				e => e.module === 'tokenFactory' && e.name === 'newToken',
			);
			const mintEvents = result.filter(e => e.module === 'token' && e.name === 'mint');

			await this.handleNewTokenEvents(newTokenEvents);
			await this.handleMintEvents(mintEvents);
		}

		await setLastEventHeight(this._pluginDB, height);
	}

	private async handleNewTokenEvents(newTokenEvents: ApiEventResult[]): Promise<void> {
		for (const newTokenEvent of newTokenEvents) {
			const parsedData = codec.decode<NewTokenEventData>(
				newTokenDataSchema,
				Buffer.from(newTokenEvent.data, 'hex'),
			);
			await this._saveEventInfoToDB(parsedData, newTokenEvent.height);
		}
	}

	private async handleMintEvents(mintEvents: ApiEventResult[]): Promise<void> {
		for (const mintEvent of mintEvents) {
			const parsedData = codec.decode<{
				address: Buffer;
				tokenID: Buffer;
				amount: bigint;
				result: number;
			}>(mintEventSchema, Buffer.from(mintEvent.data, 'hex'));
			const event = await getSingleEventTokenInfo(this._pluginDB, parsedData.tokenID);
			event.totalSupply += parsedData.amount;
			await setSingleEventTokenInfo(this._pluginDB, parsedData.tokenID, event);
		}
	}

	private async _saveEventInfoToDB(
		parsedData: NewTokenEventData,
		chainHeight: number,
	): Promise<string> {
		// 1. Saves newly generated new token events to the database
		await setEventNewTokenInfo(this._pluginDB, parsedData, chainHeight);
		// 2. Saves incremented tokenID value
		await setLastTokenID(this._pluginDB, parsedData.tokenID);
		// 3. Saves last checked block's height
		// await setLastEventHeight(this._pluginDB, chainHeight);
		return 'Data Saved';
	}

	public get nodeModulePath(): string {
		return __filename;
	}

	public async load(): Promise<void> {
		this._pluginDB = await getDBInstance(this.dataPath);
		this.endpoint.init(this._pluginDB, this.config.chainID);

		setInterval(() => {
			this._syncChainEvents();
		}, this.config.syncInterval);
	}

	public async unload(): Promise<void> {
		this._pluginDB.close();
	}
}
