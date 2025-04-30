import { Constructor } from '@core/types';
import { ProviderInjector } from '@core/injectors';
import { ControllersRegistry, ProvidersRegistry } from '@core/registries';
import { InternalServerException, NotFoundException } from '@core/exceptions';
import { getMetadata } from '@core/decorators';
import { DESIGN_PARAM_TYPES, INJECT_METADATA } from '@core/constants';

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
			const injections = dependencies.map((dependency, index) => {
				const providerName =
					getMetadata(INJECT_METADATA, target, index.toString()) ??
					dependency.name;

				const provider = ProvidersRegistry.get(providerName);
				if (!provider) {
					throw new InternalServerException("Provider doesn't exist");
				}

				return ProviderInjector.resolve(
					provider.constructor,
					providerName,
					acceptedProviders
				);
			});
			controller.instance = new target(...injections);
		}

		return controller.instance;
	}
}
