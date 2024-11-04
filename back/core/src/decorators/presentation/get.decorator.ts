import "reflect-metadata";
import { HttpMethod } from "../../constants";
import { PATH_PARAMS, ROUTES } from "./constants";

export const Get = (path?: string) => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    descriptor.value = function ({
      request: { pathParam, queryParam, bodyParam },
    }: any = {}) {
      const args: any[] = [];

      const params =
        Reflect.getMetadata(PATH_PARAMS, target, propertyKey) || [];
      params.map((param: any) => {
        if (!param.key) {
          return { pathParam, queryParam, bodyParam };
        }

        if (pathParam[param.key] && queryParam[param.key]) {
          throw new Error(
            "The queryParam and the pathParam cannot have the same key"
          );
        }

        args[param.index] = pathParam[param.key] ?? queryParam[param.key];
      });
      return args.length
        ? originalMethod.apply(this, args)
        : originalMethod.apply(this, {
            pathParam,
            queryParam,
            bodyParam,
          });
    };

    const existingRoutes = Reflect.getMetadata(ROUTES, target) || [];
    const route = {
      method: HttpMethod.GET,
      methodName: propertyKey,
      path,
      args: [],
    };
    Reflect.defineMetadata(ROUTES, [...existingRoutes, route], target);

    return descriptor;
  };
};
