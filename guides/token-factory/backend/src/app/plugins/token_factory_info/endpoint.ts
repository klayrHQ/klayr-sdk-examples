/* eslint-disable dot-notation */
import { BasePluginEndpoint, PluginEndpointContext, db as klayrDB, cryptography } from 'klayr-sdk';
import { getEventNewTokenInfo, getLastTokenID } from './db';

export class Endpoint extends BasePluginEndpoint {
	private _pluginDB!: klayrDB.Database;
	private _tokenIDZero!: Buffer;

	// Initialize the database instance here
	public init(db: klayrDB.Database, chainID: string) {
		this._pluginDB = db;
		const tokenIDZeroBuffer = Buffer.alloc(4);
		tokenIDZeroBuffer.writeUInt32BE(0);
		this._tokenIDZero = Buffer.concat([Buffer.from(chainID, 'hex'), tokenIDZeroBuffer]);
	}

	public async getTokenList(_context: PluginEndpointContext): Promise<unknown[]> {
		const data: {
			tokenID: string;
			owner: string;
			name: string;
			symbol: string;
			totalSupply: string;
			blockHeight: number;
		}[] = [];
		const lastTokenID = await getLastTokenID(this._pluginDB);
		const tokenList = await getEventNewTokenInfo(this._pluginDB, this._tokenIDZero, lastTokenID);

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
