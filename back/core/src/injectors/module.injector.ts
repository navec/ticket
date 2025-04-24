import {
	PROVIDER_SCOPE_METADATA,
	getMetadata,
	ModulesRegistry,
	Constructor,
} from '..';
import { ControllerInjector } from './controller.injector';
import { ProviderInjector } from './provider.injector';

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

			const providers = metadata.providers || [];
			providers.forEach((provider: Constructor) => {
				ProviderInjector.resolve(provider, providers);
			});

			const controllers = metadata.controllers || [];
			controllers.forEach((controller: Constructor) => {
				ControllerInjector.resolve(controller, controllers, providers);
			});

			module.instance = new target();
		}

		return module.instance;
	}
}
