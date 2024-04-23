import { BaseMethod, CommandExecuteContext } from 'klayr-sdk';
import { OwnerStore } from './stores/owner';
import { CounterStore, CounterStoreData, counterKey } from './stores/counter';
import { TokenStore } from './stores/token';
import { CreateTokenParams } from './commands/create_token_command';

export class InternalMethod extends BaseMethod {
	private _chainID!: Buffer;

	public async init(chainID: Buffer): Promise<void> {
		this._chainID = chainID;
	}

	public async getNextTokenIDAndSetStores(
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
