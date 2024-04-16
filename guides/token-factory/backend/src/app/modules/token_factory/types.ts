import { JSONObject } from 'lisk-sdk';

export type TokenID = Buffer;

export interface ModuleConfig {
	maxNameLength: number;
	maxSymbolLength: number;
	maxTotalSupply: bigint;
	minAmountToMint: bigint;
	maxAmountToMint: bigint;
	chainID: Buffer;
}

export type ModuleConfigJSON = JSONObject<ModuleConfig>;
