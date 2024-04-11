import { BaseStore } from 'lisk-sdk';

export interface TokenStoreData {
	tokenID: number;
	name: string;
	symbol: string;
	totalSupply: number;
}

export const tokenStoreSchema = {
	$id: '/token_factory/token',
	type: 'object',
	required: ['tokenID', 'name', 'symbol', 'totalSupply'],
	properties: {
		tokenID: {
			dataType: 'uint32',
			fieldNumber: 1,
		},
		name: {
			dataType: 'string',
			fieldNumber: 2,
		},
		symbol: {
			dataType: 'string',
			fieldNumber: 3,
		},
		totalSupply: {
			dataType: 'uint64',
			fieldNumber: 4,
		},
	},
};

export class TokenStore extends BaseStore<TokenStoreData> {
	public schema = tokenStoreSchema;
}
