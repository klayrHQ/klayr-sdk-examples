import { Modules } from 'klayr-sdk';

export interface MessageStoreData {
	message: string;
}

export const messageStoreSchema = {
	$id: '/hello/message',
	type: 'object',
	required: ['message'],
	properties: {
		message: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export class MessageStore extends Modules.BaseStore<MessageStoreData> {
	public schema = messageStoreSchema;
}
