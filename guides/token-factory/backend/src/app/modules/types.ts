import { JSONObject } from 'lisk-sdk';

export type TokenID = Buffer;

export interface ModuleConfig {
	maxNameLength: number;
	maxSymbolLength: number;
	maxTotalSupply: number;
	minAmountToMint: bigint;
	maxAmountToMint: bigint;
}

export type ModuleConfigJSON = JSONObject<ModuleConfig>;
