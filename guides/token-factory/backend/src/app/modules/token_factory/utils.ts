import { ModuleConfig, ModuleConfigJSON } from './types';

export const getModuleConfig = (config: ModuleConfigJSON): ModuleConfig => {
	return {
		...config,
		maxTotalSupply: BigInt(config.maxTotalSupply),
	};
};
