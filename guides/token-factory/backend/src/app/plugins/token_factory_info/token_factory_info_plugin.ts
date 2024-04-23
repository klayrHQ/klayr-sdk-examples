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
	private _tokenIDZero!: Buffer;

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
		const res = await this.apiClient.invoke<{ header: { height: number } }>(
			'chain_getLastBlock',
			{},
		);

		const heightObj = await this._getLastHeight();
		const lastStoredHeight = heightObj.height + 1;
		const { height } = res.header;

		for (let index = lastStoredHeight; index <= height; index += 1) {
			const result = await this.apiClient.invoke<ApiEventResult[]>('chain_getEvents', {
				height: index,
			});

			await Promise.all([this._handleNewTokenEvents(result), this._handleMintBurnEvents(result)]);
		}

		await setLastEventHeight(this._pluginDB, height);
	}

	private async _handleNewTokenEvents(result: ApiEventResult[]): Promise<void> {
		const newTokenEvents = result.filter(e => e.module === 'tokenFactory' && e.name === 'newToken');

		for (const newTokenEvent of newTokenEvents) {
			const parsedData = codec.decode<NewTokenEventData>(
				newTokenDataSchema,
				Buffer.from(newTokenEvent.data, 'hex'),
			);
			await this._saveEventInfoToDB(parsedData, newTokenEvent.height);
		}
	}

	private async _handleMintBurnEvents(result: ApiEventResult[]): Promise<void> {
		const mintBurnEvents = result.filter(
			e =>
				(e.module === 'token' && e.name === 'mint') || (e.module === 'token' && e.name === 'burn'),
		);

		for (const mintBurnEvent of mintBurnEvents) {
			const parsedData = codec.decode<{
				address: Buffer;
				tokenID: Buffer;
				amount: bigint;
				result: number;
			}>(mintEventSchema, Buffer.from(mintBurnEvent.data, 'hex'));
			// want to skip the events from tokenID 0 since it does not exist in the plugin
			if (parsedData.tokenID.equals(this._tokenIDZero)) continue;

			// Adjust total supply
			const event = await getSingleEventTokenInfo(this._pluginDB, parsedData.tokenID);
			if (mintBurnEvent.name === 'mint') event.totalSupply += parsedData.amount;
			if (mintBurnEvent.name === 'burn') event.totalSupply -= parsedData.amount;
			await setSingleEventTokenInfo(this._pluginDB, parsedData.tokenID, event);
		}
	}

	private async _saveEventInfoToDB(
		parsedData: NewTokenEventData,
		chainHeight: number,
	): Promise<string> {
		await Promise.all([
			setEventNewTokenInfo(this._pluginDB, parsedData, chainHeight),
			setLastTokenID(this._pluginDB, parsedData.tokenID),
		]);
		return 'Data Saved';
	}

	public get nodeModulePath(): string {
		return __filename;
	}

	public async load(): Promise<void> {
		const tokenIDZeroBuffer = Buffer.alloc(4);
		tokenIDZeroBuffer.writeUInt32BE(0);
		this._tokenIDZero = Buffer.concat([Buffer.from(this.config.chainID, 'hex'), tokenIDZeroBuffer]);

		this._pluginDB = await getDBInstance(this.dataPath);
		this.endpoint.init(this._pluginDB, this._tokenIDZero);

		setInterval(() => {
			this._syncChainEvents();
		}, this.config.syncInterval);
	}

	public async unload(): Promise<void> {
		this._pluginDB.close();
	}
}
