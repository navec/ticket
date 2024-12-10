import {PROVIDER_SCOPE_METADATA, getMetadata, ModulesRegistry} from '..';
import {ControllerScanner} from './controller.scanner';
import {ProviderScanner} from './provider.scanner';

export class ModuleScanner {
  public static scan(moduleName: any, modules: any[]) {
    modules.forEach((module: any) => {
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
