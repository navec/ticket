import {DESIGN_PARAM_TYPES, getMetadata, ProvidersRegistry} from '..';

export class ProviderInjector {
  static resolve(
    target: any,
    acceptedProviders = ProvidersRegistry.keys(),
    alreadyResolved = new Set(),
  ) {
    // Vérifie que le provider a bien été scanné
    if (!acceptedProviders.includes(target)) {
      throw new Error();
    }

    // Vérifie les dependances cyclique
    if (alreadyResolved.has(target)) {
      throw new Error();
    }

    const provider = ProvidersRegistry.get(target);
    if (!provider) {
      throw new Error(`Provider not found for: ${target}`);
    }

    if (!provider.instance) {
      const dependencies = getMetadata(DESIGN_PARAM_TYPES, target) || [];
      const injections = dependencies.map((dependency: any) => {
        return this.resolve(dependency, acceptedProviders, alreadyResolved);
      });
      provider.instance = new target(...injections);
    }

    alreadyResolved.add(provider);
    return provider.instance;
  }
}
