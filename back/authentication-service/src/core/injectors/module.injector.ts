import {PROVIDER_SCOPE_METADATA, getMetadata, ModulesRegistry} from '..';
import {ControllerInjector} from './controller.injector';
import {ProviderInjector} from './provider.injector';

export class ModuleInjector {
  static resolve(target: any) {
    const module = ModulesRegistry.get(target);
    if (!module) {
      throw new Error(`Module not found for: ${target}`);
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
      providers.forEach((provider: any) => {
        ProviderInjector.resolve(provider, providers);
      });

      const controllers = metadata.controllers || [];
      controllers.forEach((controller: any) => {
        ControllerInjector.resolve(controller, controllers, providers);
      });

      module.instance = new target();
    }

    return module.instance;
  }
}
