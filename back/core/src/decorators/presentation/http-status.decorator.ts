import "reflect-metadata";
import { HttpStatusCode } from "../../constants";

export const HttpStatus = (code: HttpStatusCode) => {
  return function (
    _: any,
    __: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const { response } = args[args.length - 1];
      response.statusCode = code;
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};
