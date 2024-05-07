import { CommandVerifyContext, GenesisConfig, VerifyStatus } from 'klayr-sdk';
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
		minAmountToBurn: BigInt(config.minAmountToBurn),
		chainID: Buffer.from(genesisConfig.chainID, 'hex'),
	};
};

export const failWithLog = <T>(context: CommandVerifyContext<T>, message: string) => {
	const error = Error(message);
	context.logger.info(error);
	return {
		status: VerifyStatus.FAIL,
		error,
	};
};
