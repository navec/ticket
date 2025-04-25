import { Constructor } from '@core/types';
import { ModuleInjector } from './module.injector';

export class Injector {
	inject(module: Constructor) {
		ModuleInjector.resolve(module);
	}
}
