/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'klayr-sdk';
import { TokenFactoryInfoPlugin } from './plugins/token_factory_info/token_factory_info_plugin';

export const registerPlugins = (app: Application): void => {
	app.registerPlugin(new TokenFactoryInfoPlugin());
};
