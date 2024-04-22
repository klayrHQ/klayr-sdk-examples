import { BaseEvent } from 'klayr-sdk';

export interface NewTokenEventData {
	owner: Buffer;
	tokenID: Buffer;
	name: string;
	symbol: string;
	totalSupply: bigint;
}

export const newTokenDataSchema = {
	$id: 'token_factory/events/new_token',
	title: 'New token created with the createToken command',
	type: 'object',
	required: ['owner', 'name', 'symbol', 'totalSupply'],
	properties: {
		owner: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		tokenID: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
		name: {
			dataType: 'string',
			fieldNumber: 3,
			minLength: 1,
			maxLength: 256,
		},
		symbol: {
			dataType: 'string',
			fieldNumber: 4,
			minLength: 1,
			maxLength: 256,
		},
		totalSupply: {
			dataType: 'uint64',
			fieldNumber: 5,
		},
	},
};

export class NewTokenEvent extends BaseEvent<NewTokenEventData> {
	public schema = newTokenDataSchema;
}
