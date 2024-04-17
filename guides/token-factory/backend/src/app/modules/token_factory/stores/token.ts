import { BaseStore } from 'klayr-sdk';

export interface TokenStoreData {
	name: string;
	symbol: string;
	totalSupply: bigint;
}

export const tokenStoreSchema = {
	$id: '/token_factory/token',
	type: 'object',
	required: ['name', 'symbol', 'totalSupply'],
	properties: {
		name: {
			dataType: 'string',
			fieldNumber: 1,
		},
		symbol: {
			dataType: 'string',
			fieldNumber: 2,
		},
		totalSupply: {
			dataType: 'uint64',
			fieldNumber: 3,
		},
	},
};

export class TokenStore extends BaseStore<TokenStoreData> {
	public schema = tokenStoreSchema;
}
