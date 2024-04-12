import { ModuleConfig, ModuleConfigJSON } from '../types';

export const getModuleConfig = (config: ModuleConfigJSON): ModuleConfig => {
	return {
		...config,
		minAmountToMint: BigInt(config.minAmountToMint),
		maxAmountToMint: BigInt(config.maxAmountToMint),
	};
};
