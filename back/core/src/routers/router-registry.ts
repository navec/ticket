import {
  getMetadata,
  HttpMethod,
  EndpointsRegistry,
  ControllersRegistry,
  METHOD_METADATA,
  PATH_METADATA,
} from "..";

export class RouterRegistry {
  public register() {
    const controllers = ControllersRegistry.keys();

    controllers.forEach((controller) => {
      const controllerInstance = ControllersRegistry.get(controller).instance;
      const basePath = getMetadata(PATH_METADATA, controller);
      const methods = Reflect.ownKeys(controller.prototype);

      methods
        .filter(
          (methodName) =>
            methodName !== "constructor" &&
            getMetadata(PATH_METADATA, controllerInstance[methodName])
        )
        .forEach((methodName) => {
          const method = controllerInstance[methodName];
          const path: string = getMetadata(PATH_METADATA, method);
          const type = getMetadata(METHOD_METADATA, method);
          const boundMethod = method.bind(controllerInstance);
          console.log(
            "\x1b[33m",
            `[INFO] : ${HttpMethod[type]} ${basePath}${path} of ${methodName.toString()} in ${controller.name} controller`
          );
          EndpointsRegistry.register(`/${basePath}${path}`, {
            controller: controllerInstance,
            method: { bound: boundMethod, name: methodName.toString() },
          });
        });
    });
  }
}
