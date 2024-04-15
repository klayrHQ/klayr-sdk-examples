import { BaseStore } from 'lisk-sdk';

export interface CounterStoreData {
	counter: bigint;
}

export const counterKey = Buffer.alloc(0);

export const counterStoreSchema = {
	$id: '/token_factory/counter',
	type: 'object',
	required: ['counter'],
	properties: {
		counter: {
			dataType: 'uint64',
			fieldNumber: 1,
		},
	},
};

export class CounterStore extends BaseStore<CounterStoreData> {
	public schema = counterStoreSchema;
}
