import {getMetadata, DESIGN_PARAM_TYPES, PROVIDER_SCOPE_METADATA} from '..';

export class AutoLoader {
  public static moduleRegistry = new Map();
  public static providersRegistry = new Map();
  public static controllersRegistry = new Map();

  public static loadProvider(
    provider: any,
    acceptedProviders: any[],
    alreadyLoaded = new Set()
  ) {
    const metadata = getMetadata(PROVIDER_SCOPE_METADATA, provider);
    if (metadata.type !== 'provider') {
      const message = `provider type is required, currently we have ${metadata.type} type`;
      throw new Error(message);
    }

    if (!acceptedProviders.includes(provider)) {
      throw new Error(
        `${provider.name} is not accepted. Here is accepted provider list [ ${acceptedProviders.map(({name}) => name).join(', ')} ].`
      );
    }

    if (alreadyLoaded.has(provider)) {
      throw new Error(
        `We have a cyclic dependency with ${provider.name} provider`
      );
    }

    const params = getMetadata(DESIGN_PARAM_TYPES, provider);
    if (!params) {
      const instance = new provider();
      this.providersRegistry.set(provider, instance);
      return instance;
    }

    const dependencies = params.map((dependency: any) => {
      if (!this.providersRegistry.has(dependency)) {
        const instance = this.loadProvider(dependency, acceptedProviders);
        this.providersRegistry.set(dependency, instance);
      }
      return this.providersRegistry.get(dependency);
    });
    alreadyLoaded.add(provider);

    const instance = new provider(...dependencies);
    this.providersRegistry.set(provider, instance);
    return instance;
  }

  public static loadController(
    controller: any,
    acceptedControllers: any[],
    alreadyLoaded = new Set()
  ) {
    const metadata = getMetadata(PROVIDER_SCOPE_METADATA, controller);
    if (metadata.type !== 'controller') {
      const message = `controller type is required, currently we have ${metadata.type} type`;
      throw new Error(message);
    }

    if (!acceptedControllers.includes(controller)) {
      throw new Error(
        `${controller.name} is not accepted. Here is accepted controller list [ ${acceptedControllers.map(({name}) => name).join(', ')} ].`
      );
    }

    if (alreadyLoaded.has(controller)) {
      throw new Error(
        `We have a cyclic dependency with ${controller.name} controller`
      );
    }

    const params = getMetadata(DESIGN_PARAM_TYPES, controller);
    if (!params) {
      const instance = new controller();
      this.controllersRegistry.set(controller, instance);
      return instance;
    }

    const dependencies = params.map((dependency: any) => {
      if (!this.providersRegistry.has(dependency)) {
        const instance = this.loadProvider(dependency, acceptedControllers);
        this.providersRegistry.set(dependency, instance);
      }
      return this.providersRegistry.get(dependency);
    });
    alreadyLoaded.add(controller);

    const instance = new controller(...dependencies);
    this.controllersRegistry.set(controller, instance);

    return instance;
  }

  public static loadModule(target: any, alreadyLoaded = new Set()) {
    const metadata = getMetadata(PROVIDER_SCOPE_METADATA, target);
    if (metadata.type !== 'module') {
      const message = `module type is required, currently we have ${metadata.type} type`;
      throw new Error(message);
    }

    if (alreadyLoaded.has(target)) {
      throw new Error(`We have a cyclic dependency with ${target.name} module`);
    }

    alreadyLoaded.add(target);

    (metadata.imports || []).forEach((module: any) => {
      this.loadModule(module, alreadyLoaded);
    });

    const instance = new target();
    const providers = metadata.providers || [];
    const controllers = metadata.controllers || [];

    providers.forEach((p: any) => this.loadProvider(p, providers));
    controllers.forEach((c: any) => this.loadController(c, controllers));
    this.moduleRegistry.set(target, {instance, providers, controllers});
  }
}