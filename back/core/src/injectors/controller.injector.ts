import {
  ControllersRegistry,
  DESIGN_PARAM_TYPES,
  ProvidersRegistry,
  getMetadata,
} from '..';
import {ProviderInjector} from './provider.injector';

export class ControllerInjector {
  static resolve(
    target: any,
    acceptedControllers = ControllersRegistry.keys(),
    acceptedProviders = ProvidersRegistry.keys()
  ) {
    // Vérifie que le provider a bien été scanné
    if (!acceptedControllers.includes(target)) {
      throw new Error();
    }

    const controller = ControllersRegistry.get(target);
    if (!controller) {
      throw new Error(`Controller not found for: ${target}`);
    }

    if (!controller.instance) {
      const dependencies = getMetadata(DESIGN_PARAM_TYPES, target) || [];
      const injections = dependencies.map((provider: any) => {
        return ProviderInjector.resolve(provider, acceptedProviders);
      });
      controller.instance = new target(...injections);
    }

    return controller.instance;
  }
}
