import { ModuleOptions } from '../../types';
import { MODULE_METADATA, PROVIDER_SCOPE_METADATA } from '../../constants';
import { Scope } from '../../enums';

export const Module = (opts: ModuleOptions) => {
	return (target: object) => {
		Reflect.defineMetadata(MODULE_METADATA, true, target);
		Reflect.defineMetadata(
			PROVIDER_SCOPE_METADATA,
			{ ...opts, type: 'module', scope: Scope.SINGLETON },
			target
		);
	};
};
