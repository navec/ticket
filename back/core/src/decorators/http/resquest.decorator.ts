import {METHOD_METADATA, PATH_METADATA} from '../../constants';
import {HttpMethod} from '../../enums';

const createHttpRequest = (httpMethod: HttpMethod, path = '/') => {
  return function (
    _: unknown,
    __: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    Reflect.defineMetadata(PATH_METADATA, path, originalMethod);
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
