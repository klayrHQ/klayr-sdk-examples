import { BaseStore } from 'lisk-sdk';

export interface OwnerStoreData {
	address: Buffer;
}

export const ownerStoreSchema = {
	$id: '/token_factory/owner',
	type: 'object',
	required: ['address'],
	properties: {
		address: {
			dataType: 'bytes',
			fieldNumber: 1,
			format: 'lisk32',
		},
	},
};

export class OwnerStore extends BaseStore<OwnerStoreData> {
	public schema = ownerStoreSchema;
}
