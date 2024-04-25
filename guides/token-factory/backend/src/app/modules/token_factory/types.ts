import { JSONObject } from 'klayr-sdk';

export type TokenID = Buffer;

export interface ModuleConfig {
	maxNameLength: number;
	maxSymbolLength: number;
	maxTotalSupply: bigint;
	minAmountToMint: bigint;
	maxAmountToMint: bigint;
	chainID: Buffer;
	createTokenFee: bigint;
}

export type ModuleConfigJSON = JSONObject<ModuleConfig>;
