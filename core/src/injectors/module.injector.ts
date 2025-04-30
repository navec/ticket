import { Constructor } from '@core/types';
import { ModulesRegistry } from '@core/registries';
import { getMetadata } from '@core/decorators';
import { PROVIDER_SCOPE_METADATA } from '@core/constants';

import { ControllerInjector, ProviderInjector } from '@core/injectors';

export class ModuleInjector {
	static resolve(target: Constructor) {
		const module = ModulesRegistry.get(target);
		if (!module) {
			throw new Error(`Module not found for: ${target.name}`);
		}

		if (!module.instance) {
			const metadata = getMetadata(PROVIDER_SCOPE_METADATA, target);
			if (metadata.type !== 'module') {
				const message = `module type is required, currently we have ${metadata.type} type`;
				throw new Error(message);
			}

			const modules = metadata.imports || [];
			modules.forEach(ModuleInjector.resolve);

			const providers: Constructor[] = metadata.providers || [];

			const providersName = providers.map((provider) => {
				const { name } = getMetadata(PROVIDER_SCOPE_METADATA, provider);
				return name;
			});
			providers.forEach((provider, index) => {
				ProviderInjector.resolve(provider, providersName[index], providersName);
			});

			const controllers = metadata.controllers || [];
			controllers.forEach((controller: Constructor) => {
				ControllerInjector.resolve(controller, controllers, providersName);
			});

			module.instance = new target();
		}

		return module.instance;
	}
}
