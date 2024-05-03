import { JSONObject } from 'klayr-sdk';

export type TokenID = Buffer;

export interface TokenInfoData {
	name: string;
	symbol: string;
	totalSupply: bigint;
	owner: string;
}

export interface ModuleConfig {
	maxNameLength: number;
	maxSymbolLength: number;
	maxTotalSupply: bigint;
	minAmountToMint: bigint;
	maxAmountToMint: bigint;
	minAmountToBurn: bigint;
	chainID: Buffer;
}

export type ModuleConfigJSON = JSONObject<ModuleConfig>;
