import { DESIGN_PARAM_TYPES, INJECT_METADATA } from '@core/constants';
import { getMetadata } from '@core/decorators';
import { InternalServerException, NotFoundException } from '@core/exceptions';
import { ProvidersRegistry } from '@core/registries';
import { Constructor } from '@core/types';

export class ProviderInjector {
	static resolve(
		target: Constructor,
		targetName: string,
		acceptedProviders = ProvidersRegistry.keys(),
		alreadyResolved = new Set()
	) {
		if (!acceptedProviders.includes(targetName)) {
			throw new InternalServerException(
				`Target ${targetName} is not in the list of accepted providers.`
			);
		}

		if (alreadyResolved.has(target)) {
			throw new InternalServerException(
				`Circular dependency detected while resolving ${targetName}.`
			);
		}

		const provider = ProvidersRegistry.get(targetName);
		if (!provider) {
			throw new NotFoundException(`Provider not found for: ${target}`);
		}

		if (!provider.instance) {
			const dependencies =
				getMetadata<Constructor[]>(DESIGN_PARAM_TYPES, target) || [];
			const injections = dependencies.map((dep, index) => {
				const name =
					getMetadata(INJECT_METADATA, target, `${index}`) ?? dep.name;
				const currentProvider = ProvidersRegistry.get(name);
				if (!currentProvider) {
					throw new InternalServerException(
						`Provider ${name} doesn't exist ${target.name} provider, please check if ${name} is present in your module configuration`
					);
				}
				return this.resolve(
					currentProvider.constructor,
					name,
					acceptedProviders,
					alreadyResolved
				);
			});
			provider.instance = new target(...injections);
		}

		alreadyResolved.add(provider);
		return provider.instance;
	}
}
