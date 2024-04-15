// import * as modules from '../../../src/app/modules/tokenFactory'

import { TokenFactoryModule } from '@app/modules/token_factory/module';

describe('TokenFactoryModule', () => {
	const genesisConfig: any = {};
	const defaultConfig = {
		maxNameLength: 30,
		maxSymbolLength: 5,
		maxTotalSupply: BigInt(1e18),
		minAmountToMint: BigInt(1000),
		maxAmountToMint: BigInt(1e6) * BigInt(1e8),
	};
	let tokenFactory: TokenFactoryModule;

	beforeEach(async () => {
		tokenFactory = new TokenFactoryModule();
		await tokenFactory.init({ genesisConfig, moduleConfig: defaultConfig });
	});

	describe('init', () => {
		it('should initialize config with default values when module config is empty', async () => {
			expect(tokenFactory['_moduleConfig'].maxNameLength).toBe(defaultConfig.maxNameLength);
			expect(tokenFactory['_moduleConfig'].maxSymbolLength).toBe(defaultConfig.maxSymbolLength);
			expect(tokenFactory['_moduleConfig'].maxTotalSupply).toBe(defaultConfig.maxTotalSupply);
			expect(tokenFactory['_moduleConfig'].maxAmountToMint).toBe(defaultConfig.maxAmountToMint);
		});

		it('should initialize config with custom values when module config is set', async () => {
			const moduleConfig = {
				maxNameLength: 66,
				maxSymbolLength: 8,
				maxTotalSupply: BigInt(1e10),
			};
			tokenFactory = new TokenFactoryModule();

			await expect(
				tokenFactory.init({
					genesisConfig,
					moduleConfig: moduleConfig,
				}),
			).resolves.toBeUndefined();

			expect(tokenFactory['_moduleConfig'].maxNameLength).toBe(moduleConfig.maxNameLength);
			expect(tokenFactory['_moduleConfig'].maxSymbolLength).toBe(moduleConfig.maxSymbolLength);
			expect(tokenFactory['_moduleConfig'].maxTotalSupply).toBe(defaultConfig.maxTotalSupply);
			expect(tokenFactory['_moduleConfig'].maxAmountToMint).toBe(defaultConfig.maxAmountToMint);
		});

		it('should not initialize config with invalid value for `maxSymbolLength`', async () => {
			const moduleConfig = {
				maxNameLength: 30,
				maxSymbolLength: -1,
				maxTotalSupply: BigInt(1e10),
			};
			tokenFactory = new TokenFactoryModule();

			await expect(
				tokenFactory.init({
					genesisConfig,
					moduleConfig: moduleConfig,
				}),
			).rejects.toThrow();
		});
	});

	describe('beforeTransactionsExecute', () => {
		it.todo('should execute before block execute');
	});
	describe('afterTransactionsExecute', () => {
		it.todo('should execute after block execute');
	});
	describe('beforeCommandExecute', () => {
		it.todo('should execute before transaction execute');
	});
	describe('afterCommandExecute', () => {
		it.todo('should execute after transaction execute');
	});
	describe('beforeTransactionsExecute', () => {
		it.todo('should execute after genesis execute');
	});
	describe('afterTransactionsExecute', () => {
		it.todo('should execute after genesis execute');
	});
});
