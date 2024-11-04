import "reflect-metadata";
import { BODY_PARAMS, REQUEST_PARAMS } from "./constants";

export const ReqParam = (): ParameterDecorator => {
  return function (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) {
    if (!propertyKey) {
      throw new Error(`Use functional error for ${ReqParam.name} decorator`);
    }

    const data = { index: parameterIndex };
    Reflect.defineMetadata(REQUEST_PARAMS, data, target, propertyKey);
  };
};
