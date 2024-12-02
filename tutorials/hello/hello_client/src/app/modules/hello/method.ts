import { Modules, StateMachine } from 'klayr-sdk';
import { MessageStore, MessageStoreData } from './stores/message';

export class HelloMethod extends Modules.BaseMethod {
	public async getHello(
		methodContext: StateMachine.ImmutableMethodContext,
		address: Buffer,
	): Promise<MessageStoreData> {
		// 1. Get message store
		const messageSubStore = this.stores.get(MessageStore);
		// 2. Get the Hello message for the address from the message store
		const helloMessage = await messageSubStore.get(methodContext, address);
		// 3. Return the Hello message
		return helloMessage;
	}
}
