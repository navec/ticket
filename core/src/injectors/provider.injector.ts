import { DESIGN_PARAM_TYPES } from '@core/constants';
import { getMetadata } from '@core/decorators';
import { InternalServerException, NotFoundException } from '@core/exceptions';
import { ProvidersRegistry } from '@core/registries';
import { Constructor } from '@core/types';

export class ProviderInjector {
	static resolve(
		target: Constructor,
		acceptedProviders = ProvidersRegistry.keys(),
		alreadyResolved = new Set()
	) {
		if (!acceptedProviders.includes(target)) {
			throw new InternalServerException(
				`Target ${target.name} is not in the list of accepted providers.`
			);
		}

		if (alreadyResolved.has(target)) {
			throw new InternalServerException(
				`Circular dependency detected while resolving ${target.name}.`
			);
		}

		const provider = ProvidersRegistry.get(target);
		if (!provider) {
			throw new NotFoundException(`Provider not found for: ${target}`);
		}

		if (!provider.instance) {
			const dependencies =
				getMetadata<Constructor[]>(DESIGN_PARAM_TYPES, target) || [];
			const injections = dependencies.map((dependency) => {
				return this.resolve(dependency, acceptedProviders, alreadyResolved);
			});
			provider.instance = new target(...injections);
		}

		alreadyResolved.add(provider);
		return provider.instance;
	}
}
