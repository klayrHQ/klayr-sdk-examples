export const configSchema = {
	$id: '/plugins/token_factory/config',
	type: 'object',
	properties: {
		syncInterval: {
			dataType: 'uint32',
			fieldNumber: 1,
		},
		chainID: {
			dataType: 'string',
			fieldNumber: 2,
		},
	},
	required: ['syncInterval', 'chainID'],
	default: {
		syncInterval: 20000, // milliseconds
		chainID: '12345678',
	},
};

export const mintEventSchema = {
	$id: 'token_factory/mintEvent',
	type: 'object',
	properties: {
		address: {
			dataType: 'bytes',
			fieldNumber: 1,
			format: 'klayr32',
		},
		tokenID: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
		amount: {
			dataType: 'uint64',
			fieldNumber: 3,
		},
		result: {
			dataType: 'uint32',
			fieldNumber: 4,
		},
	},
	required: ['address', 'tokenID', 'amount', 'result'],
};

export const newTokenEventSchema = {
	$id: 'token_factory/new_token',
	title: 'New token created with the createToken command',
	type: 'object',
	required: ['owner', 'name', 'symbol', 'totalSupply', 'height'],
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
		height: {
			dataType: 'uint32',
			fieldNumber: 6,
		},
	},
};

export const heightSchema = {
	$id: '/token_factory/height',
	type: 'object',
	required: ['height'],
	properties: {
		height: {
			dataType: 'uint32',
			fieldNumber: 1,
		},
	},
};
