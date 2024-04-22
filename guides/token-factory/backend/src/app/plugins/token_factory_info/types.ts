export interface TokenFactoryInfoPluginConfig {
	syncInterval: number;
	chainID: string;
}

export interface NewTokenEvent {
	owner: Buffer;
	tokenID: Buffer;
	name: string;
	symbol: string;
	totalSupply: bigint;
	height: number;
}

export interface TokenIDCounter {
	tokenID: number;
}

export interface Height {
	height: number;
}

export interface ApiEventResult {
	data: string;
	height: number;
	module: string;
	name: string;
}
