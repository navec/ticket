import {
  Constructor,
  ControllersRegistry,
  getMetadata,
  PROVIDER_SCOPE_METADATA,
} from '..';

export class ControllerScanner {
  public static scan(controllers: Constructor[]) {
    controllers.forEach((controller: Constructor) => {
      const metadata = getMetadata(PROVIDER_SCOPE_METADATA, controller);
      if (metadata.type !== 'controller') {
        const message = `controller type is required, currently we have ${metadata.type} type`;
        throw new Error(message);
      }

      ControllersRegistry.register(controller);
    });
  }
}
