import { Plugins, Types, db as klayrDB, cryptography } from 'klayr-sdk';
import { getEventHelloInfo } from './db';

export class Endpoint extends Plugins.BasePluginEndpoint {
	private _pluginDB!: klayrDB.Database;

	// Initialize the database instance here
	public init(db: klayrDB.Database) {
		this._pluginDB = db;
	}

	// Returns all Sender Addresses, Hello Messages, and Block Height of the block where the Hello Event was emitted.
	public async getMessageList(_context: Types.PluginEndpointContext): Promise<unknown[]> {
		const data: {
			ID: number;
			senderAddress: string;
			message: string;
			blockHeight;
		}[] = [];
		// 1. Get all the stored events from the database.
		const messageList = await getEventHelloInfo(this._pluginDB);
		// 2. Push them into an array for presentation.
		for (const helloMessage of messageList) {
			data.push({
				ID: helloMessage.id.readUInt32BE(0),
				senderAddress: cryptography.address.getKlayr32AddressFromAddress(
					helloMessage['senderAddress'],
				),
				message: helloMessage['message'],
				blockHeight: helloMessage['height'],
			});
		}
		return data;
	}
}
