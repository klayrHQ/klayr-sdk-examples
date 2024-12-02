/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */
import { validator } from '@klayr/validator';
import { Modules, StateMachine, utils } from 'klayr-sdk';
import { CreateHelloCommand } from './commands/create_hello_command';
import { HelloEndpoint } from './endpoint';
import { HelloMethod } from './method';
import {
	configSchema,
	getHelloCounterResponseSchema,
	getHelloRequestSchema,
	getHelloResponseSchema,
} from './schema';
import { CounterStore } from './stores/counter';
import { MessageStore } from './stores/message';
import { ModuleConfigJSON } from './types';
import { NewHelloEvent } from './events/new_hello';

export const defaultConfig = {
	maxMessageLength: 256,
	minMessageLength: 3,
	blacklist: ['illegalWord1'],
};

export class HelloModule extends Modules.BaseModule {
	public endpoint = new HelloEndpoint(this.stores, this.offchainStores);
	public method = new HelloMethod(this.stores, this.events);
	public commands = [new CreateHelloCommand(this.stores, this.events)];

	public constructor() {
		super();
		// registeration of stores and events
		this.stores.register(CounterStore, new CounterStore(this.name, 0));
		this.stores.register(MessageStore, new MessageStore(this.name, 1));
		this.events.register(NewHelloEvent, new NewHelloEvent(this.name));
	}

	public metadata(): Modules.ModuleMetadata {
		return {
			endpoints: [
				{
					name: this.endpoint.getHello.name,
					request: getHelloRequestSchema,
					response: getHelloResponseSchema,
				},
				{
					name: this.endpoint.getHelloCounter.name,
					response: getHelloCounterResponseSchema,
				},
			],
			commands: this.commands.map(command => ({
				name: command.name,
				params: command.schema,
			})),
			events: this.events.values().map(v => ({
				name: v.name,
				data: v.schema,
			})),
			assets: [],
			stores: [],
		};
	}

	// Lifecycle hooks
	// public async init(_args: Modules.ModuleInitArgs): Promise<void> {
	// 	// initialize this module when starting a node
	// }

	public async init(args: Modules.ModuleInitArgs): Promise<void> {
		// Get the module config defined in the config.json file
		const { moduleConfig } = args;
		// Overwrite the default module config with values from config.json, if set
		const config = utils.objects.mergeDeep({}, defaultConfig, moduleConfig) as ModuleConfigJSON;
		// Validate the provided config with the config schema
		validator.validate<ModuleConfigJSON>(configSchema, config);
		// Call the command init() method with config as parameter
		this.commands[0].init(config).catch(err => {
			console.log('Error: ', err);
		});
	}

	// public async insertAssets(_context: StateMachine.InsertAssetContext) {
	// 	// initialize block generation, add asset
	// }

	// public async verifyAssets(_context: StateMachine.BlockVerifyContext): Promise<void> {
	// 	// verify block
	// }

	// Lifecycle hooks
	public async verifyTransaction(
		context: StateMachine.TransactionVerifyContext,
	): Promise<StateMachine.VerificationResult> {
		// verify transaction will be called multiple times in the transaction pool
		// return { status: StateMachine.VerifyStatus.OK };
		context.logger.info('TX VERIFICATION');
		const result = {
			status: 1,
		};
		return result;
	}

	// public async beforeCommandExecute(_context: StateMachine.TransactionExecuteContext): Promise<void> {
	// }

	// public async afterCommandExecute(_context: StateMachine.TransactionExecuteContext): Promise<void> {

	// }
	// public async initGenesisState(_context: StateMachine.GenesisBlockExecuteContext): Promise<void> {

	// }

	// public async finalizeGenesisState(_context: StateMachine.GenesisBlockExecuteContext): Promise<void> {

	// }

	// public async beforeTransactionsExecute(_context: StateMachine.BlockExecuteContext): Promise<void> {

	// }

	// public async afterTransactionsExecute(_context: StateMachine.BlockAfterExecuteContext): Promise<void> {

	// }
}
