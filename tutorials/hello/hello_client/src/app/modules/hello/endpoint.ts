import { cryptography, Modules, Types } from 'klayr-sdk';
import { MessageStore, MessageStoreData } from './stores/message';
import { counterKey, CounterStore, CounterStoreData } from './stores/counter';

export class HelloEndpoint extends Modules.BaseEndpoint {
	public async getHello(ctx: Types.ModuleEndpointContext): Promise<MessageStoreData> {
		// 1. Get message store
		const messageSubStore = this.stores.get(MessageStore);
		// 2. Get the address from the endpoint params
		const { address } = ctx.params;
		// 3. Validate address
		if (typeof address !== 'string') {
			throw new Error('Parameter address must be a string.');
		}
		cryptography.address.validateKlayr32Address(address);
		// 4. Get the Hello message for the address from the message store
		const helloMessage = await messageSubStore.get(
			ctx,
			cryptography.address.getAddressFromKlayr32Address(address),
		);
		// 5. Return the Hello message
		return helloMessage;
	}

	public async getHelloCounter(ctx: Types.ModuleEndpointContext): Promise<CounterStoreData> {
		const counterSubStore = this.stores.get(CounterStore);

		const helloCounter = await counterSubStore.get(ctx, counterKey);

		return helloCounter;
	}
}
