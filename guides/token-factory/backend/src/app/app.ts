import { Application, PartialApplicationConfig } from 'klayr-sdk';
import { registerPlugins } from './plugins';
import { TokenFactoryModule } from './modules/token_factory/module';

export const getApplication = (config: PartialApplicationConfig): Application => {
	const { app, method } = Application.defaultApplication(config);

	const tokenFactoryModule = new TokenFactoryModule();
	tokenFactoryModule.addDependencies(method.token, method.fee);

	app.registerModule(tokenFactoryModule);
	registerPlugins(app);

	return app;
};
