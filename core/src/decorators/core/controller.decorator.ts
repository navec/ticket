import {
	CONTROLLER_METADATA,
	PATH_METADATA,
	PROVIDER_SCOPE_METADATA,
} from '@core/constants';
import { Scope } from '@core/enums';

export const Controller = (path = '') => {
	return (target: object) => {
		const opts = { type: 'controller', scope: Scope.SINGLETON };

		const formattedPath = path.replace(/^\/|\/$/g, '');

		Reflect.defineMetadata(PROVIDER_SCOPE_METADATA, opts, target);
		Reflect.defineMetadata(PATH_METADATA, formattedPath, target);
		Reflect.defineMetadata(CONTROLLER_METADATA, true, target);
	};
};
