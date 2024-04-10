import { BaseStore } from 'lisk-sdk';

export interface TokenStoreData {
	name: string;
	symbol: string;
	totalSupply: number;
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
			dataType: 'uint256',
			fieldNumber: 3,
		},
	},
};

export class TokenStore extends BaseStore<TokenStoreData> {
	public schema = tokenStoreSchema;
}
