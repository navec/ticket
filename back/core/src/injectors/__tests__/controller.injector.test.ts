import {describe, it, expect, vi} from 'vitest';
import {ControllerInjector} from '../controller.injector';
import {ControllersRegistry, ProvidersRegistry} from 'core/src';
import {ProviderInjector} from '../provider.injector';
import * as Utils from 'core/src/decorators/utils';

vi.mock('core/src/decorators/utils', async () => {
  const actual = await vi.importActual('core/src/decorators/utils');
  return {...actual, getMetadata: vi.fn()};
});

describe('ControllerInjector', () => {
  const getMetadataSpy = vi.spyOn(Utils, 'getMetadata');
  const providerResolveSpy = vi.spyOn(ProviderInjector, 'resolve');

  it('should throw an error if the controller is not in the accepted controllers', () => {
    const target = class {};
    ControllersRegistry.register(target);

    const callback = () => ControllerInjector.resolve(target, []);

    expect(callback).toThrowError('Internal Server Error');
  });

  it('should throw an error if the controller is not found in the registry', () => {
    const target = class {};

    const callback = () => ControllerInjector.resolve(target, [target]);

    expect(callback).toThrowError(`Controller not found for: ${target.name}`);
  });

  it('should resolve a controller instance if it exists in the registry', () => {
    const dependency = class {};
    const target = class {};

    ControllersRegistry.register(target);
    ProvidersRegistry.register(dependency);

    getMetadataSpy.mockReturnValueOnce([dependency]);
    providerResolveSpy.mockImplementation(() => ({}));

    const instance = ControllerInjector.resolve(target);

    expect(instance).toBeInstanceOf(target);
    expect(ProviderInjector.resolve).toHaveBeenCalledWith(dependency, [
      dependency,
    ]);
  });

  it('should reuse an existing controller instance if already resolved', () => {
    const target = class {};
    const existingInstance = new target();
    ControllersRegistry.register(target, existingInstance);

    const instance = ControllerInjector.resolve(target);

    expect(instance).toBe(existingInstance);
  });

  it('should inject dependencies into the controller constructor', () => {
    const dependency = class {};
    const target = class {
      constructor(public dep: unknown) {}
    };
    ControllersRegistry.register(target);
    ProvidersRegistry.register(dependency, {instance: {}});
    getMetadataSpy.mockReturnValueOnce([dependency]);
    providerResolveSpy.mockImplementation(() => 'mockDependency');

    const instance = ControllerInjector.resolve(target) as InstanceType<
      typeof target
    >;

    expect(instance.dep).toBe('mockDependency');
  });
});
