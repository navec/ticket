import "reflect-metadata";
import { HttpMethod } from "../../constants";
import { GLOBAL_INSTANCES_STORAGE } from "../constants";
import { ALL_ROUTES } from "../../constants/routes.constant";
import { getInstanceFromStorageOrThrow } from "../../utils/getInstanceFromStorageOrThrow.util";

export const Controller = (base: string = "/") => {
  const basePath = base.charAt(0) === "/" ? base : `/${base}`;
  return function <T extends { new (...args: any[]): {} }>(target: T) {
    const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];
    const injectedDependencies = dependencies.map((dependency: T) => {
      return getInstanceFromStorageOrThrow(dependency);
    });
    const instance: any = new target(...injectedDependencies);

    (Reflect.getMetadata("ROUTES", target.prototype) || []).forEach(
      (item: { method: HttpMethod; methodName: string; path?: string }) => {
        ALL_ROUTES.push({
          path: [basePath, item.path].filter(Boolean).join("/"),
          handler: instance[item.methodName].bind(instance),
          method: item.method,
        });
      }
    );
    GLOBAL_INSTANCES_STORAGE[target.name] = instance;
  };
};
