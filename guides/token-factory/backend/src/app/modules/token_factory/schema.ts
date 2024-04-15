export const createTokenSchema = {
	$id: 'token_factory/createToken-params',
	title: 'CreateTokenCommand transaction parameter for the Token Factory module',
	type: 'object',
	required: ['name', 'symbol', 'totalSupply'],
	properties: {
		name: {
			dataType: 'string',
			fieldNumber: 1,
			minLength: 1,
			maxLength: 256,
		},
		symbol: {
			dataType: 'string',
			fieldNumber: 2,
			minLength: 1,
			maxLength: 256,
		},
		totalSupply: {
			dataType: 'uint64',
			fieldNumber: 3,
		},
	},
};

export const configSchema = {
	$id: '/token_factory/config',
	type: 'object',
	properties: {
		maxNameLength: {
			dataType: 'uint32',
			fieldNumber: 1,
		},
		maxSymbolLength: {
			dataType: 'uint32',
			fieldNumber: 2,
		},
		maxTotalSupply: {
			dataType: 'uint64',
			fieldNumber: 3,
		},
	},
	required: ['maxNameLength', 'maxSymbolLength', 'maxTotalSupply'],
};
