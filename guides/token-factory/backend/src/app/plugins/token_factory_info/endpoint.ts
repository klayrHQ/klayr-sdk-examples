/* eslint-disable dot-notation */
import { BasePluginEndpoint, PluginEndpointContext, db as klayrDB, cryptography } from 'klayr-sdk';
import { getEventNewTokenInfo, getLastTokenID } from './db';

export class Endpoint extends BasePluginEndpoint {
	private _pluginDB!: klayrDB.Database;
	private _tokenIDZero!: Buffer;

	// Initialize the database instance here
	public init(db: klayrDB.Database, tokenIDZero: Buffer) {
		this._pluginDB = db;
		this._tokenIDZero = tokenIDZero;
	}

	public async getTokenList(context: PluginEndpointContext): Promise<unknown[]> {
		const data: {
			tokenID: string;
			owner: string;
			name: string;
			symbol: string;
			totalSupply: string;
			blockHeight: number;
		}[] = [];
		const address = context.params.address as string;
		const lastTokenID = await getLastTokenID(this._pluginDB);
		const tokenList = await getEventNewTokenInfo(
			this._pluginDB,
			this._tokenIDZero,
			lastTokenID,
			address,
		);

		for (const token of tokenList) {
			data.push({
				tokenID: token.tokenID.toString('hex'),
				owner: cryptography.address.getKlayr32AddressFromAddress(token.owner),
				name: token.name,
				symbol: token.symbol,
				totalSupply: token.totalSupply.toString(),
				blockHeight: token.height,
			});
		}
		return data;
	}
}
