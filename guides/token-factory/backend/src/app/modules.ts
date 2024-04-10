/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { TokenFactoryModule } from './modules/token_factory/module';

export const registerModules = (app: Application): void => {
	app.registerModule(new TokenFactoryModule());
};
