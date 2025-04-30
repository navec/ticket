import { AutoLoader } from '@core/injectors';

const mockGetMetadata = jest.fn();
jest.mock('@core/decorators', () => ({
	...jest.requireActual('@core/decorators'),
	getMetadata: (...args: unknown[]) => mockGetMetadata(...args),
}));

// const mockGetMetadata = jest.fn();
// jest.mock('@core/injectors', () => ({
// 	...jest.requireActual('@core/injectors'),
// 	getMetadata: (...args: unknown[]) => mockGetMetadata(...args),
// }));

describe(AutoLoader.name, () => {
	const MockProvider = class MockProvider {};
	const MockController = class MockController {};
	const MockModule = class MockModule {};

	describe(AutoLoader.loadProvider.name, () => {
		it('should throw an error if provider type is not "provider"', () => {
			mockGetMetadata.mockReturnValue({ type: 'invalid' });
			const expectedMessage =
				'provider type is required, currently we have invalid type';

			const callback = () =>
				AutoLoader.loadProvider(MockProvider, [MockProvider]);

			expect(callback).toThrowError(expectedMessage);
		});

		it('should throw an error if provider is not in the accepted list', () => {
			mockGetMetadata.mockReturnValue({ type: 'provider' });
			const expectedMessage =
				'MockProvider is not accepted. Here is accepted provider list [  ].';

			const callback = () => AutoLoader.loadProvider(MockProvider, []);

			expect(callback).toThrowError(expectedMessage);
		});

		it('should throw an error if there is a cyclic dependency', () => {
			const alreadyLoaded = new Set([MockProvider]);
			mockGetMetadata.mockReturnValue({ type: 'provider' });
			const expectedMessage =
				'We have a cyclic dependency with MockProvider provider';

			const callback = () =>
				AutoLoader.loadProvider(MockProvider, [MockProvider], alreadyLoaded);

			expect(callback).toThrowError(expectedMessage);
		});

		it('should load a provider without dependencies', () => {
			mockGetMetadata
				.mockReturnValueOnce({ type: 'provider' })
				.mockReturnValueOnce(undefined);

			const instance = AutoLoader.loadProvider(MockProvider, [MockProvider]);

			expect(instance).toBeInstanceOf(MockProvider);
			expect(AutoLoader.providersRegistry.get(MockProvider)).toBe(instance);
		});

		it('should load a provider with dependencies', () => {
			const Dependency = class Dependency {};
			mockGetMetadata
				.mockReturnValueOnce({ type: 'provider' })
				.mockReturnValueOnce([Dependency])
				.mockReturnValueOnce({ type: 'provider' })
				.mockReturnValueOnce(undefined);

			const instance = AutoLoader.loadProvider(MockProvider, [
				MockProvider,
				Dependency,
			]);

			expect(instance).toBeInstanceOf(MockProvider);
			expect(AutoLoader.providersRegistry.get(MockProvider)).toBe(instance);
		});
	});

	describe(AutoLoader.loadController.name, () => {
		it('should throw an error if controller type is not "controller"', () => {
			mockGetMetadata.mockReturnValue({ type: 'invalid' });
			const expectedMessage =
				'controller type is required, currently we have invalid type';

			const callback = () =>
				AutoLoader.loadController(MockController, [MockController]);

			expect(callback).toThrowError(expectedMessage);
		});

		it('should throw an error if controller is not in the accepted list', () => {
			mockGetMetadata.mockReturnValue({ type: 'controller' });
			const expectedMessage =
				'MockController is not accepted. Here is accepted controller list [  ].';

			const callback = () => AutoLoader.loadController(MockController, []);

			expect(callback).toThrowError(expectedMessage);
		});

		it('should throw an error if there is a cyclic dependency', () => {
			mockGetMetadata.mockReturnValue({ type: 'controller' });
			const alreadyLoaded = new Set([MockController]);
			const expectedMessage =
				'We have a cyclic dependency with MockController controller';

			const callback = () =>
				AutoLoader.loadController(
					MockController,
					[MockController],
					alreadyLoaded
				);

			expect(callback).toThrowError(expectedMessage);
		});

		it('should load a controller without dependencies', () => {
			mockGetMetadata
				.mockReturnValueOnce({ type: 'controller' })
				.mockReturnValueOnce(undefined);

			const instance = AutoLoader.loadController(MockController, [
				MockController,
			]);

			expect(instance).toBeInstanceOf(MockController);
			expect(AutoLoader.controllersRegistry.get(MockController)).toBe(instance);
		});

		it('should load a controller with dependencies', () => {
			const Dependency = class Dependency {};
			mockGetMetadata
				.mockReturnValueOnce({ type: 'controller' })
				.mockReturnValueOnce([Dependency])
				.mockReturnValueOnce({ type: 'provider' })
				.mockReturnValueOnce(undefined);

			const instance = AutoLoader.loadController(MockController, [
				MockController,
				Dependency,
			]);

			expect(instance).toBeInstanceOf(MockController);
			expect(AutoLoader.controllersRegistry.get(MockController)).toBe(instance);
		});
	});

	describe(AutoLoader.loadModule.name, () => {
		it('should throw an error if module type is not "module"', () => {
			mockGetMetadata.mockReturnValue({ type: 'invalid' });
			const expectedMessage =
				'module type is required, currently we have invalid type';

			const callback = () => AutoLoader.loadModule(MockModule);

			expect(callback).toThrowError(expectedMessage);
		});

		it('should throw an error if there is a cyclic dependency', () => {
			mockGetMetadata.mockReturnValue({ type: 'module' });
			const alreadyLoaded = new Set([MockModule]);
			const expectedMessage =
				'We have a cyclic dependency with MockModule module';

			const callback = () => AutoLoader.loadModule(MockModule, alreadyLoaded);

			expect(callback).toThrowError(expectedMessage);
		});

		it('should load a module with providers and controllers', () => {
			const Provider = class Provider {};
			const Controller = class Controller {};

			mockGetMetadata
				.mockReturnValueOnce({
					type: 'module',
					providers: [Provider],
					controllers: [Controller],
					imports: [],
				})
				.mockReturnValueOnce({ type: 'provider' })
				.mockReturnValueOnce(undefined)
				.mockReturnValueOnce({ type: 'controller' })
				.mockReturnValueOnce(undefined);

			AutoLoader.loadModule(MockModule);

			expect(AutoLoader.moduleRegistry.has(MockModule)).toBe(true);
			expect(AutoLoader.providersRegistry.has(Provider)).toBe(true);
			expect(AutoLoader.controllersRegistry.has(Controller)).toBe(true);
		});

		it('should load a module with imported modules', () => {
			const ImportedModule = class ImportedModule {};
			mockGetMetadata
				.mockReturnValueOnce({ type: 'module', imports: [ImportedModule] })
				.mockReturnValueOnce({ type: 'module' });

			AutoLoader.loadModule(MockModule);

			expect(AutoLoader.moduleRegistry.has(MockModule)).toBe(true);
			expect(AutoLoader.moduleRegistry.has(ImportedModule)).toBe(true);
		});
	});
});
