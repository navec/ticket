import 'reflect-metadata';
import { INJECT_METADATA } from '@core/constants';

export const Inject = (token: string | symbol) => {
	return (
		target: object,
		propertyKey: string | symbol | undefined,
		parameterIndex: number
	) => {
		Reflect.defineMetadata(
			INJECT_METADATA,
			token,
			target,
			parameterIndex.toString()
		);
	};
};
