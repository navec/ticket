import {Constructor} from '..';
import {ModuleInjector} from './module.injector';

export class Injector {
  inject(module: Constructor) {
    ModuleInjector.resolve(module);
  }
}
