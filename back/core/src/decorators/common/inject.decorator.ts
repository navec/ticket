import "reflect-metadata";
import { CONSTRUCTOR_PARAMS } from "./constants";
import { DESIGN_PARAM_TYPES, GLOBAL_INSTANCES_STORAGE } from "../constants";

export const Inject = (input?: string) => {
  return function <T extends { new (...args: any[]): {} }>(
    target: T,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) {
    const dependencies = Reflect.getMetadata(DESIGN_PARAM_TYPES, target) || [];
    const name = input ?? dependencies[0].name;
    const injectedDependency = GLOBAL_INSTANCES_STORAGE[name];

    if (!injectedDependency) {
      throw new Error(
        `The class named ${name} must be stored if we want to inject it into ${target.name}`
      );
    }

    Reflect.defineMetadata(
      CONSTRUCTOR_PARAMS,
      injectedDependency,
      target,
      parameterIndex.toString()
    );
  };
};
