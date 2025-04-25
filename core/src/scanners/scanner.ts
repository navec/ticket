import { Constructor } from '@core/types';
import { ModuleScanner } from './module.scanner';

export class Scanner {
	public scan(module: Constructor) {
		ModuleScanner.scan(module.name, [module]);
	}
}
