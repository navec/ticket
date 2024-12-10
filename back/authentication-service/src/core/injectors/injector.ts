import {ModulesRegistry} from '../registries';
import {ModuleInjector} from './module.injector';

export class Injector {
  static resolveMainModule(module: any) {
    ModuleInjector.resolve(module);
  }
  inject(module: any) {
    ModuleInjector.resolve(module);
  }
}
