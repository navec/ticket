import { ModuleScanner } from '@core/scanners';
import { PROVIDER_SCOPE_METADATA } from '@core/constants';
import { Constructor } from '@core/types';

const mockProviderScanner = jest.fn();
const mockControllerScanner = jest.fn();
jest.mock('@core/scanners', () => ({
	...jest.requireActual('@core/scanners'),
	ProviderScanner: {
		scan: (...args: unknown[]) => mockProviderScanner(...args),
	},
	ControllerScanner: {
		scan: (...args: unknown[]) => mockControllerScanner(...args),
	},
}));

const mockGetMetadata = jest.fn();
jest.mock('@core/decorators', () => ({
	getMetadata: (...args: unknown[]) => mockGetMetadata(...args),
}));

const mockModulesRegistry = jest.fn();
jest.mock('@core/registries/module.registry', () => ({
	ModulesRegistry: {
		register: (...args: unknown[]) => mockModulesRegistry(...args),
	},
}));

describe('ModuleScanner', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should throw an error if a module is null or undefined', () => {
		const modules = [null as unknown as Constructor];

		const callback = () => ModuleScanner.scan('TestModule', modules);

		expect(callback).toThrowError(
			'You have may be a ciclic imports in TestModule module'
		);
	});

	it('should throw an error if metadata type is not "module"', () => {
		const TestModule = class TestModule {};
		mockGetMetadata.mockReturnValueOnce({ type: 'provider' });

		const callback = () => ModuleScanner.scan('TestModule', [TestModule]);

		expect(callback).toThrow(
			'module type is required, currently we have provider type'
		);
	});

	it('should register the module and scan its imports, providers, and controllers', () => {
		const TestModule = class TestModule {};
		mockGetMetadata
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

		expect(mockModulesRegistry).toHaveBeenCalledWith(TestModule);
		expect(mockGetMetadata).toHaveBeenCalledWith(
			PROVIDER_SCOPE_METADATA,
			TestModule
		);
		expect(mockProviderScanner).toHaveBeenCalledWith([expect.any(Function)]);
		expect(mockControllerScanner).toHaveBeenCalledWith([expect.any(Function)]);
	});

	it('should handle nested module imports', () => {
		const TestModule = class TestModule {};
		const NestedModule = class NestedModule {};
		mockGetMetadata
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

		expect(mockModulesRegistry).toHaveBeenCalledTimes(2);
		expect(mockModulesRegistry).toHaveBeenCalledWith(TestModule);
		expect(mockModulesRegistry).toHaveBeenCalledWith(NestedModule);
	});
});
