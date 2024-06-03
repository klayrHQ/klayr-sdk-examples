/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'klayr-sdk';
import { TokenFactoryInfoPlugin } from './plugins/token_factory_info/token_factory_info_plugin';
import { DashboardPlugin } from '@klayr/dashboard-plugin';
import { FaucetPlugin } from '@klayr/faucet-plugin';

export const registerPlugins = (app: Application): void => {
	app.registerPlugin(new TokenFactoryInfoPlugin());
	app.registerPlugin(new DashboardPlugin());
	app.registerPlugin(new FaucetPlugin());
};
