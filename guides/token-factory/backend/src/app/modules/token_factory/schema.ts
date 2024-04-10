export const createTokenSchema = {
	$id: 'token_factory/createToken-params',
	title: 'CreateTokenCommand transaction parameter for the Token Factory module',
	type: 'object',
	required: ['name'],
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
			type: 'integer',
			format: 'uint32',
		},
		maxSymbolLength: {
			type: 'integer',
			format: 'uint32',
		},
		maxTotalSupply: {
			type: 'integer',
			format: 'uint64',
		},
	},
	required: ['maxNameLength', 'maxSymbolLength', 'maxTotalSupply'],
};
