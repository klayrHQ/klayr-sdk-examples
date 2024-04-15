import { BaseStore } from 'lisk-sdk';

export interface TokenStoreData {
	tokenID: bigint;
	name: string;
	symbol: string;
	totalSupply: bigint;
}

export const tokenStoreSchema = {
	$id: '/token_factory/token',
	type: 'object',
	required: ['tokenID', 'name', 'symbol', 'totalSupply'],
	properties: {
		tokenID: {
			dataType: 'uint64',
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
