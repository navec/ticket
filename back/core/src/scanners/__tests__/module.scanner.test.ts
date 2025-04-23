import {describe, it, expect, vi, afterEach, Mock} from 'vitest';
import {ModuleScanner} from '../module.scanner';
import {
  Constructor,
  getMetadata,
  ModulesRegistry,
  PROVIDER_SCOPE_METADATA,
} from 'core/src';
import {ProviderScanner} from '../provider.scanner';
import {ControllerScanner} from '../controller.scanner';

vi.mock('../provider.scanner', () => ({
  ProviderScanner: {scan: vi.fn()},
}));

vi.mock('../controller.scanner', () => ({
  ControllerScanner: {scan: vi.fn()},
}));

vi.mock('core/src', async importOriginal => {
  const actual = await importOriginal<typeof import('core/src')>();
  return {
    ...actual,
    ModulesRegistry: {register: vi.fn()},
    getMetadata: vi.fn(),
  };
});

describe('ModuleScanner', () => {
  const getMetadataSpy = vi.mocked(getMetadata) as Mock;
  const modulesRegistrySpy = vi.mocked(ModulesRegistry.register) as Mock;
  const providerScanSpy = vi.mocked(ProviderScanner.scan) as Mock;
  const controllerScanSpy = vi.mocked(ControllerScanner.scan) as Mock;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error if a module is null or undefined', () => {
    const modules = [null as unknown as Constructor];

    const callback = () => ModuleScanner.scan('TestModule', modules);

    expect(callback).toThrowError(
      'You have may be a ciclic imports in TestModule module',
    );
  });

  it('should throw an error if metadata type is not "module"', () => {
    const TestModule = class TestModule {};
    getMetadataSpy.mockReturnValueOnce({type: 'provider'});

    const callback = () => ModuleScanner.scan('TestModule', [TestModule]);

    expect(callback).toThrowError(
      'module type is required, currently we have provider type',
    );
  });

  it('should register the module and scan its imports, providers, and controllers', () => {
    const TestModule = class TestModule {};
    getMetadataSpy
      .mockReturnValueOnce({
        type: 'module',
        imports: [class ImportModule {}],
        providers: [class Provider {}],
        controllers: [class Controller {}],
      })
      .mockReturnValueOnce({
        type: 'module',
        imports: [],
        providers: [],
        controllers: [],
      });

    ModuleScanner.scan('TestModule', [TestModule]);

    expect(modulesRegistrySpy).toHaveBeenCalledWith(TestModule);
    expect(getMetadataSpy).toHaveBeenCalledWith(
      PROVIDER_SCOPE_METADATA,
      TestModule,
    );
    expect(providerScanSpy).toHaveBeenCalledWith([expect.any(Function)]);
    expect(controllerScanSpy).toHaveBeenCalledWith([expect.any(Function)]);
  });

  it('should handle nested module imports', () => {
    const TestModule = class TestModule {};
    const NestedModule = class NestedModule {};
    getMetadataSpy
      .mockReturnValueOnce({
        type: 'module',
        imports: [NestedModule],
        providers: [],
        controllers: [],
      })
      .mockReturnValueOnce({
        type: 'module',
        imports: [],
        providers: [],
        controllers: [],
      });

    ModuleScanner.scan('TestModule', [TestModule]);

    expect(modulesRegistrySpy).toHaveBeenCalledTimes(2);
    expect(modulesRegistrySpy).toHaveBeenCalledWith(TestModule);
    expect(modulesRegistrySpy).toHaveBeenCalledWith(NestedModule);
  });
});
