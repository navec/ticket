import { MODULE_METADATA, PROVIDER_SCOPE_METADATA } from '@core/constants';
import { Scope } from '@core/enums';
import { ModuleOptions } from '@core/types';

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
