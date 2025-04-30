import { INJECTABLE_METADATA, PROVIDER_SCOPE_METADATA } from '@core/constants';
import { Scope } from '@core/enums';

export const Injectable = (name?: string) => {
	return (target: object & { name: string }) => {
		const opts = {
			type: 'provider',
			name: name ?? target.name,
			scope: Scope.SINGLETON,
		};
		Reflect.defineMetadata(PROVIDER_SCOPE_METADATA, opts, target);
		Reflect.defineMetadata(INJECTABLE_METADATA, true, target);
	};
};
