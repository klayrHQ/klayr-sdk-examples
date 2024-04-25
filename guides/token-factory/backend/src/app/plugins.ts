/* eslint-disable @typescript-eslint/no-empty-function */
import { DashboardPlugin } from '@klayr/dashboard-plugin';
import { Application } from 'klayr-sdk';

export const registerPlugins = (app: Application): void => {
	app.registerPlugin(new DashboardPlugin());
};
