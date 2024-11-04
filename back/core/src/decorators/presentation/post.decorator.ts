import "reflect-metadata";
import { HttpMethod } from "../../constants";
import { BODY_PARAMS, REQUEST_PARAMS, ROUTES } from "./constants";

export const Post = (path?: string) => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    descriptor.value = function ({ request, response }: any = {}) {
      const args: any[] = [];

      const bodyParams =
        Reflect.getMetadata(BODY_PARAMS, target, propertyKey) || [];

      bodyParams.map((param: any) => {
        if (!param.key) {
          args[param.index] = request.bodyParam;
          return;
        }

        if (request.pathParam[param.key] && request.bodyParam[param.key]) {
          throw new Error(
            "The bodyParam and the pathParam cannot have the same key"
          );
        }

        args[param.index] =
          request.pathParam[param.key] ?? request.bodyParam[param.key];
      });

      const requestParams = Reflect.getMetadata(
        REQUEST_PARAMS,
        target,
        propertyKey
      );
      if (requestParams) {
        args[requestParams.index] = request;
      }

      return originalMethod.apply(this, [...args, { response }]);
    };

    const existingRoutes = Reflect.getMetadata(ROUTES, target) || [];
    const route = {
      method: HttpMethod.POST,
      methodName: propertyKey,
      path,
      args: [],
    };
    Reflect.defineMetadata(ROUTES, [...existingRoutes, route], target);

    return descriptor;
  };
};
