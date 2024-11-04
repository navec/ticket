import "reflect-metadata";
import { BODY_PARAMS } from "./constants";

export const BodyParam = (paramKey?: string): ParameterDecorator => {
  return function (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) {
    if (!propertyKey) {
      throw new Error(`Use functional error for ${BodyParam.name} decorator`);
    }

    const data = Reflect.getMetadata(BODY_PARAMS, target, propertyKey) || [];
    data.push({ index: parameterIndex, key: paramKey });
    Reflect.defineMetadata(BODY_PARAMS, data, target, propertyKey);
  };
};
