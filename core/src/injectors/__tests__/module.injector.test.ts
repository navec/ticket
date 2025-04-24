import { describe, it, expect, vi, Mock, afterEach } from 'vitest';
import { ModuleInjector } from '../module.injector';
import { ProviderInjector } from '../provider.injector';
import { ControllerInjector } from '../controller.injector';
import {
	ModulesRegistry,
	PROVIDER_SCOPE_METADATA,
	getMetadata,
} from 'core/src';

vi.mock('core/src', async () => {
	const actual = await vi.importActual('core/src');
	return { ...actual, ModulesRegistry: { get: vi.fn() }, getMetadata: vi.fn() };
});

vi.mock('../provider.injector', async () => {
	const actual = await vi.importActual('../provider.injector');
	return { ...actual, resolve: vi.fn() };
});

vi.mock('../controller.injector', async () => {
	const actual = await vi.importActual('../controller.injector');
	return { ...actual, resolve: vi.fn() };
});

describe('ModuleInjector', () => {
	const getMetadataSpy = getMetadata as Mock;
	const modulesRegistrySpy = vi.spyOn(ModulesRegistry, 'get');
	const providersInjectorSpy = vi.spyOn(ProviderInjector, 'resolve');
	const controllersInjectorSpy = vi.spyOn(ControllerInjector, 'resolve');

	afterEach(getMetadataSpy.mockClear);

	it('should throw an error if the module is not found', () => {
		const TestModule = class TestModule {};
		modulesRegistrySpy.mockReturnValueOnce(undefined);

		const callback = () => ModuleInjector.resolve(TestModule);

		expect(callback).toThrowError('Module not found for: TestModule');
	});

	it('should throw an error if metadata type is not "module"', () => {
		const TestModule = class TestModule {};
		modulesRegistrySpy.mockReturnValueOnce({ instance: null });
		getMetadataSpy.mockReturnValueOnce({ type: 'provider' });

		const callback = () => ModuleInjector.resolve(TestModule);

		expect(callback).toThrowError(
			'module type is required, currently we have provider type'
		);
	});

	it('should resolve imports, providers, and controllers and instantiate the module', () => {
		const ModuleClass = class ImportModule {};
		const ProviderClass = class Provider {};
		const ControllerClass = class Controller {};
		const mockModuleInstance = {};

		modulesRegistrySpy
			.mockReturnValueOnce({ instance: null })
			.mockReturnValueOnce({ instance: null });
		providersInjectorSpy.mockReturnValueOnce(new ProviderClass());
		controllersInjectorSpy.mockReturnValueOnce(new ControllerClass());
		const moduleInjectorSpy = vi.spyOn(ModuleInjector, 'resolve');
		getMetadataSpy
			.mockReturnValueOnce({
				type: 'module',
				imports: [ModuleClass],
				providers: [ProviderClass],
				controllers: [ControllerClass],
			})
			.mockReturnValueOnce({
				type: 'module',
				imports: [],
				providers: [],
				controllers: [],
			});

		const TestModule = class TestModule {
			constructor() {
				return mockModuleInstance;
			}
		};

		const result = ModuleInjector.resolve(TestModule);

		expect(result).toBe(mockModuleInstance);
		expect(ModulesRegistry.get).toHaveBeenCalledWith(TestModule);
		expect(getMetadataSpy).toHaveBeenCalledWith(
			PROVIDER_SCOPE_METADATA,
			TestModule
		);
		expect(ProviderInjector.resolve).toHaveBeenCalledWith(ProviderClass, [
			ProviderClass,
		]);
		expect(ControllerInjector.resolve).toHaveBeenCalledWith(
			ControllerClass,
			[ControllerClass],
			[ProviderClass]
		);
		expect(moduleInjectorSpy).toHaveBeenCalledTimes(2);
		expect(moduleInjectorSpy).toHaveBeenNthCalledWith(1, TestModule);
		expect(moduleInjectorSpy).toHaveBeenNthCalledWith(2, ModuleClass, 0, [
			ModuleClass,
		]);
	});

	it('should return the existing module instance if already resolved', () => {
		const TestModule = class TestModule {};
		const instance = new (class {})();
		modulesRegistrySpy.mockReturnValue({ instance });

		const result = ModuleInjector.resolve(TestModule);

		expect(result).toBe(instance);
		expect(modulesRegistrySpy).toHaveBeenCalledWith(TestModule);
		expect(getMetadataSpy).not.toHaveBeenCalled();
	});
});
