/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */

import { validator } from '@klayr/validator';
import {
	BaseModule,
	FeeMethod,
	ModuleInitArgs,
	ModuleMetadata,
	TokenMethod,
	utils,
} from 'klayr-sdk';
import { BatchTransferCommand } from './commands/batch_transfer_command';
import { ModuleConfig, ModuleConfigJSON } from './types';
import { BurnCommand } from './commands/burn_command';
import { CreateTokenCommand } from './commands/create_token_command';
import { MintCommand } from './commands/mint_command';
import { TokenFactoryEndpoint } from './endpoint';
import { NewTokenEvent } from './events/new_token';
import { InternalMethod } from './internal_methods';
import { TokenFactoryMethod } from './method';
import { configSchema } from './schemas';
import { CounterStore } from './stores/counter';
import { OwnerStore } from './stores/owner';
import { TokenStore } from './stores/token';
import { getModuleConfig } from './utils';

export const defaultConfig = {
	maxNameLength: 30,
	maxSymbolLength: 5,
	maxTotalSupply: BigInt(1e18), // max: 9223372036854775807 = 9e18
	minAmountToMint: BigInt(1000),
	maxAmountToMint: BigInt(1e6) * BigInt(1e8),
	createTokenFee: BigInt(100_000),
	minAmountToBurn: BigInt(1000),
};

export class TokenFactoryModule extends BaseModule {
	private readonly _internalMethod = new InternalMethod(this.stores, this.events);

	private _createTokenCommand = new CreateTokenCommand(this.stores, this.events);
	private _batchTransferCommand = new BatchTransferCommand(this.stores, this.events);
	private _mintCommand = new MintCommand(this.stores, this.events);
	private _burnCommand = new BurnCommand(this.stores, this.events);

	private _moduleConfig!: ModuleConfig;
	private _tokenMethod!: TokenMethod;
	private _feeMethod!: FeeMethod;

	public endpoint = new TokenFactoryEndpoint(this.stores, this.offchainStores);
	public tokenFactoryMethod = new TokenFactoryMethod(this.stores, this.events);
	public commands = [
		this._createTokenCommand,
		this._mintCommand,
		this._burnCommand,
		this._batchTransferCommand,
	];

	public constructor() {
		super();
		// registeration of stores and events
		this.stores.register(TokenStore, new TokenStore(this.name, 0));
		this.stores.register(CounterStore, new CounterStore(this.name, 1));
		this.stores.register(OwnerStore, new OwnerStore(this.name, 2));

		this.events.register(NewTokenEvent, new NewTokenEvent(this.name));
	}

	public addDependencies(tokenMethod: TokenMethod, feeMethod: FeeMethod) {
		this._tokenMethod = tokenMethod;
		this._feeMethod = feeMethod;
		this._createTokenCommand.addDependencies({
			internalMethod: this._internalMethod,
			tokenMethod: this._tokenMethod,
			feeMethod: this._feeMethod,
		});
		this._mintCommand.addDependencies({
			tokenFactoryMethod: this.tokenFactoryMethod,
			tokenMethod: this._tokenMethod,
		});
		this._burnCommand.addDependencies({
			tokenFactoryMethod: this.tokenFactoryMethod,
			tokenMethod: this._tokenMethod,
		});
		this._batchTransferCommand.addDependencies({
			tokenMethod: this._tokenMethod,
		});
	}

	public metadata(): ModuleMetadata {
		return {
			...this.baseMetadata(),
			commands: this.commands.map(command => ({
				name: command.name,
				params: command.schema,
			})),
			events: this.events.values().map(v => ({
				name: v.name,
				data: v.schema,
			})),
			endpoints: [],
			assets: [],
		};
	}

	// Lifecycle hooks
	public async init(args: ModuleInitArgs): Promise<void> {
		// Get the module config defined in the config.json of the node
		const { moduleConfig, genesisConfig } = args;
		// Overwrite the default module config with values from config.json, if set
		const config = utils.objects.mergeDeep({}, defaultConfig, moduleConfig) as ModuleConfigJSON;
		// Validate the config with the config schema

		validator.validate<ModuleConfigJSON>(configSchema, config);

		this._moduleConfig = getModuleConfig(config, genesisConfig);
		this._internalMethod.init(this._moduleConfig.chainID);
		this._createTokenCommand.init(this._moduleConfig).catch(err => {
			console.log('Error: ', err);
		});
		this._mintCommand
			.init({
				minAmountToMint: this._moduleConfig.minAmountToMint,
				maxAmountToMint: this._moduleConfig.maxAmountToMint,
			})
			.catch(err => {
				console.log('Error: ', err);
			});
		this._burnCommand
			.init({
				minAmountToBurn: this._moduleConfig.minAmountToBurn,
			})
			.catch(err => {
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
