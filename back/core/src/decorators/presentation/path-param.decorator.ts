import "reflect-metadata";
import { PATH_PARAMS } from "./constants";

export const PathParam = (paramKey?: string): ParameterDecorator => {
  return function (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) {
    if (!propertyKey) {
      throw new Error(`Use functional error for ${PathParam.name} decorator`);
    }

    const data = Reflect.getMetadata(PATH_PARAMS, target, propertyKey) || [];
    data.push({ index: parameterIndex, key: paramKey });
    Reflect.defineMetadata(PATH_PARAMS, data, target, propertyKey);
  };
};
