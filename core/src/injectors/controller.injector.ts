import { Constructor } from '@core/types';
import { ProviderInjector } from './provider.injector';
import { ControllersRegistry, ProvidersRegistry } from '@core/registries';
import { InternalServerException, NotFoundException } from '@core/exceptions';
import { getMetadata } from '@core/decorators';
import { DESIGN_PARAM_TYPES } from '@core/constants';

export class ControllerInjector {
	static resolve(
		target: Constructor,
		acceptedControllers = ControllersRegistry.keys(),
		acceptedProviders = ProvidersRegistry.keys()
	) {
		if (!acceptedControllers.includes(target)) {
			throw new InternalServerException();
		}

		const controller = ControllersRegistry.get(target);
		if (!controller) {
			throw new NotFoundException(`Controller not found for: ${target.name}`);
		}

		if (!controller.instance) {
			const dependencies =
				getMetadata<Constructor[]>(DESIGN_PARAM_TYPES, target) || [];
			const injections = dependencies.map((provider) => {
				return ProviderInjector.resolve(provider, acceptedProviders);
			});
			controller.instance = new target(...injections);
		}

		return controller.instance;
	}
}
