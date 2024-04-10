import { JSONObject } from 'lisk-sdk';

export interface ModuleConfig {
	maxNameLength: number;
	maxSymbolLength: number;
	maxTotalSupply: number;
}

export type ModuleConfigJSON = JSONObject<ModuleConfig>;
