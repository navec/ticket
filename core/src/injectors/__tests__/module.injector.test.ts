import { ModuleInjector } from '@core/injectors';
import { PROVIDER_SCOPE_METADATA } from '@core/constants';

const mockGetMetadata = jest.fn();
jest.mock('@core/decorators', () => ({
	...jest.requireActual('@core/decorators'),
	getMetadata: (...args: unknown[]) => mockGetMetadata(...args),
}));

const mockModulesRegistryGet = jest.fn();
jest.mock('@core/registries', () => ({
	...jest.requireActual('@core/registries'),
	ModulesRegistry: {
		get: (...args: unknown[]) => mockModulesRegistryGet(...args),
	},
}));

const mockProviderInjectorResolver = jest.fn();
const mockControllerInjectorResolver = jest.fn();
jest.mock('@core/injectors', () => ({
	...jest.requireActual('@core/injectors'),
	ProviderInjector: {
		resolve: (...args: unknown[]) => mockProviderInjectorResolver(...args),
	},
	ControllerInjector: {
		resolve: (...args: unknown[]) => mockControllerInjectorResolver(...args),
	},
}));

describe('ModuleInjector', () => {
	afterEach(mockGetMetadata.mockClear);

	it('should throw an error if the module is not found', () => {
		const TestModule = class TestModule {};
		mockModulesRegistryGet.mockReturnValueOnce(undefined);

		const callback = () => ModuleInjector.resolve(TestModule);

		expect(callback).toThrow('Module not found for: TestModule');
	});

	it('should throw an error if metadata type is not "module"', () => {
		const TestModule = class TestModule {};
		mockModulesRegistryGet.mockReturnValueOnce({ instance: null });
		mockGetMetadata.mockReturnValueOnce({ type: 'provider' });

		const callback = () => ModuleInjector.resolve(TestModule);

		expect(callback).toThrow(
			'module type is required, currently we have provider type'
		);
	});

	it('should resolve imports, providers, and controllers and instantiate the module', () => {
		const ModuleClass = class ImportModule {};
		const ProviderClass = class Provider {};
		const ControllerClass = class Controller {};
		const mockModuleInstance = {};

		mockModulesRegistryGet
			.mockReturnValueOnce({ instance: null })
			.mockReturnValueOnce({ instance: null });
		mockProviderInjectorResolver.mockReturnValueOnce(new ProviderClass());
		mockControllerInjectorResolver.mockReturnValueOnce(new ControllerClass());
		const moduleInjectorSpy = jest.spyOn(ModuleInjector, 'resolve');
		mockGetMetadata
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
			})
			.mockReturnValueOnce({ name: ProviderClass.name });

		const TestModule = class TestModule {
			constructor() {
				return mockModuleInstance;
			}
		};

		const result = ModuleInjector.resolve(TestModule);

		expect(result).toBe(mockModuleInstance);
		expect(mockModulesRegistryGet).toHaveBeenCalledWith(TestModule);
		expect(mockGetMetadata).toHaveBeenCalledWith(
			PROVIDER_SCOPE_METADATA,
			TestModule
		);
		expect(mockProviderInjectorResolver).toHaveBeenCalledWith(
			ProviderClass,
			ProviderClass.name,
			[ProviderClass.name]
		);
		expect(mockControllerInjectorResolver).toHaveBeenCalledWith(
			ControllerClass,
			[ControllerClass],
			[ProviderClass.name]
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
		mockModulesRegistryGet.mockReturnValue({ instance });

		const result = ModuleInjector.resolve(TestModule);

		expect(result).toBe(instance);
		expect(mockModulesRegistryGet).toHaveBeenCalledWith(TestModule);
		expect(mockGetMetadata).not.toHaveBeenCalled();
	});
});
