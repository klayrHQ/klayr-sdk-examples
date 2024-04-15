import { JSONObject } from 'lisk-sdk';

export interface ModuleConfig {
	maxNameLength: number;
	maxSymbolLength: number;
	maxTotalSupply: bigint;
}

export type ModuleConfigJSON = JSONObject<ModuleConfig>;
