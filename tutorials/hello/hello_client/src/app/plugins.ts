/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'klayr-sdk';
import { HelloInfoPlugin } from './plugins/hello_info/hello_info_plugin';

export const registerPlugins = (app: Application): void => {
	app.registerPlugin(new HelloInfoPlugin());
};
