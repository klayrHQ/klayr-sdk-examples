import { GenesisConfig } from 'klayr-sdk';
import { ModuleConfig, ModuleConfigJSON } from './types';

export const getModuleConfig = (
	config: ModuleConfigJSON,
	genesisConfig: GenesisConfig,
): ModuleConfig => {
	return {
		...config,
		maxTotalSupply: BigInt(config.maxTotalSupply),
		minAmountToMint: BigInt(config.minAmountToMint),
		maxAmountToMint: BigInt(config.maxAmountToMint),
		chainID: Buffer.from(genesisConfig.chainID, 'hex'),
	};
};
