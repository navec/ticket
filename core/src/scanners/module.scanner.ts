import { ModulesRegistry } from '@core/registries';

import { Constructor } from '@core/types';
import { getMetadata } from '@core/decorators';
import { PROVIDER_SCOPE_METADATA } from '@core/constants';

import { ControllerScanner, ProviderScanner } from '.';

export class ModuleScanner {
	public static scan(moduleName: string, modules: Constructor[]) {
		modules.forEach((module: Constructor) => {
			if (!module) {
				const message = `You have may be a ciclic imports in ${moduleName} module`;
				throw new Error(message);
			}

			const metadata = getMetadata(PROVIDER_SCOPE_METADATA, module);
			if (metadata.type !== 'module') {
				const message = `module type is required, currently we have ${metadata.type} type`;
				throw new Error(message);
			}

			ModulesRegistry.register(module);
			ModuleScanner.scan(module.name, metadata.imports || []);
			ProviderScanner.scan(metadata.providers || []);
			ControllerScanner.scan(metadata.controllers || []);
		});
	}
}
