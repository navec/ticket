import { METHOD_METADATA, PATH_METADATA } from '@core/constants';
import { HttpMethod } from '@core/enums';

const createHttpRequest = (httpMethod: HttpMethod, path = '/') => {
	return function (
		_: unknown,
		__: string,
		descriptor: PropertyDescriptor
	): PropertyDescriptor {
		const originalMethod = descriptor.value;

		const formattedPath = path.startsWith('/') ? path : `/${path}`;
		Reflect.defineMetadata(PATH_METADATA, formattedPath, originalMethod);
		Reflect.defineMetadata(METHOD_METADATA, httpMethod, originalMethod);
		return descriptor;
	};
};

export const Get = (path?: string) => {
	return createHttpRequest(HttpMethod.GET, path);
};

export const Post = (path?: string) => {
	return createHttpRequest(HttpMethod.POST, path);
};

export const Patch = (path?: string) => {
	return createHttpRequest(HttpMethod.PATCH, path);
};

export const Put = (path?: string) => {
	return createHttpRequest(HttpMethod.PUT, path);
};

export const Delete = (path?: string) => {
	return createHttpRequest(HttpMethod.DELETE, path);
};
