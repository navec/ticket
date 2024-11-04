import "reflect-metadata";
import { DESIGN_PARAM_TYPES, GLOBAL_INSTANCES_STORAGE } from "../constants";
import { getInstanceFromStorageOrThrow } from "../../utils/getInstanceFromStorageOrThrow.util";

export const Injectable = () => {
  return function <T extends { new (...args: any[]): {} }>(target: T) {
    const dependencies = Reflect.getMetadata(DESIGN_PARAM_TYPES, target) || [];
    const injectedDependencies = dependencies.map((dependency: unknown) =>
      getInstanceFromStorageOrThrow(dependency)
    );
    GLOBAL_INSTANCES_STORAGE[target.name] = new target(...injectedDependencies);
  };
};
