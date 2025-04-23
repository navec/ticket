import {
  Constructor,
  ControllersRegistry,
  DESIGN_PARAM_TYPES,
  InternalServerException,
  NotFoundException,
  ProvidersRegistry,
  getMetadata,
} from '..';
import {ProviderInjector} from './provider.injector';

export class ControllerInjector {
  static resolve(
    target: Constructor,
    acceptedControllers = ControllersRegistry.keys(),
    acceptedProviders = ProvidersRegistry.keys(),
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
      const injections = dependencies.map(provider => {
        return ProviderInjector.resolve(provider, acceptedProviders);
      });
      controller.instance = new target(...injections);
    }

    return controller.instance;
  }
}
