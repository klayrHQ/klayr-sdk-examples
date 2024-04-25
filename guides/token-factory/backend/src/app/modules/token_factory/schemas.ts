export const mintSchema = {
	$id: 'token_factory/mintParams',
	title: 'Mints extra tokens to a recipient',
	type: 'object',
	properties: {
		tokenID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		amount: {
			dataType: 'uint64',
			fieldNumber: 2,
		},
		recipient: {
			dataType: 'bytes',
			fieldNumber: 3,
			format: 'klayr32',
		},
	},
	required: ['amount', 'recipient'],
};

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
		minAmountToMint: {
			dataType: 'uint64',
			fieldNumber: 4,
		},
		maxAmountToMint: {
			dataType: 'uint64',
			fieldNumber: 5,
		},
		createTokenFee: {
			dataType: 'uint64',
			fieldNumber: 6,
		},
	},
	required: [
		'maxNameLength',
		'maxSymbolLength',
		'maxTotalSupply',
		'minAmountToMint',
		'maxAmountToMint',
		'createTokenFee',
	],
};
