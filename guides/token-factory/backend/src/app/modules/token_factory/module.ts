/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */

import { validator } from '@liskhq/lisk-validator';
import { BaseModule, ModuleInitArgs, ModuleMetadata, utils } from 'lisk-sdk';
import { ModuleConfigJSON } from '../types';
import { CreateTokenCommand } from './commands/create_token_command';
import { TokenFactoryEndpoint } from './endpoint';
import { TokenFactoryMethod } from './method';
import { configSchema } from './schema';
import { TokenStore } from './stores/token';

export const defaultConfig = {
	maxNameLength: 30,
	maxSymbolLength: 5,
	maxTotalSupply: 1e18, // Not sure whats normal for this chain yet
};

export class TokenFactoryModule extends BaseModule {
	public endpoint = new TokenFactoryEndpoint(this.stores, this.offchainStores);
	public method = new TokenFactoryMethod(this.stores, this.events);
	public commands = [new CreateTokenCommand(this.stores, this.events)];

	public constructor() {
		super();
		// registeration of stores and events
		this.stores.register(TokenStore, new TokenStore(this.name, 0));
	}

	public metadata(): ModuleMetadata {
		return {
			...this.baseMetadata(),
			endpoints: [],
			assets: [],
		};
	}

	// Lifecycle hooks
	public async init(args: ModuleInitArgs): Promise<void> {
		// Get the module config defined in the config.json of the node
		const { moduleConfig } = args;
		// Overwrite the default module config with values from config.json, if set
		const config = utils.objects.mergeDeep({}, defaultConfig, moduleConfig) as ModuleConfigJSON;
		// Validate the config with the config schema
		validator.validate<ModuleConfigJSON>(configSchema, config);

		this.commands[0].init(config).catch(err => {
			console.log('Error: ', err);
		});
	}

	// public async insertAssets(_context: InsertAssetContext) {
	// 	// initialize block generation, add asset
	// }

	// public async verifyAssets(_context: BlockVerifyContext): Promise<void> {
	// 	// verify block
	// }

	// Lifecycle hooks
	// public async verifyTransaction(_context: TransactionVerifyContext): Promise<VerificationResult> {
	// verify transaction will be called multiple times in the transaction pool
	// return { status: VerifyStatus.OK };
	// }

	// public async beforeCommandExecute(_context: TransactionExecuteContext): Promise<void> {
	// }

	// public async afterCommandExecute(_context: TransactionExecuteContext): Promise<void> {

	// }
	// public async initGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {

	// }

	// public async finalizeGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {

	// }

	// public async beforeTransactionsExecute(_context: BlockExecuteContext): Promise<void> {

	// }

	// public async afterTransactionsExecute(_context: BlockAfterExecuteContext): Promise<void> {

	// }
}
