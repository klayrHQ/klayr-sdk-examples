/* eslint-disable @typescript-eslint/no-empty-function */
import { Application, TokenModule } from 'lisk-sdk';
import { TokenFactoryModule } from './modules/token_factory/module';

export const registerModules = (app: Application): void => {
	const tokenModule = new TokenModule();
	const tokenFactoryModule = new TokenFactoryModule();
	tokenFactoryModule.addDependencies(tokenModule.method);

	app.registerModule(tokenFactoryModule);
};
