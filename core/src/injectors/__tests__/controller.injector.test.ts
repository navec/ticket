import { ControllerInjector } from '@core/injectors';
import { ControllersRegistry, ProvidersRegistry } from '@core/registries';

const mockGetMetadata = jest.fn();
jest.mock('@core/decorators', () => ({
	...jest.requireActual('@core/decorators'),
	getMetadata: (...args: unknown[]) => mockGetMetadata(...args),
}));

const mockProviderInjectorResolver = jest.fn();
jest.mock('@core/injectors', () => ({
	...jest.requireActual('@core/injectors'),
	ProviderInjector: {
		resolve: (...args: unknown[]) => mockProviderInjectorResolver(...args),
	},
}));

describe(ControllerInjector.name, () => {
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
		ProvidersRegistry.register({ name: dependency.name, provider: dependency });

		mockGetMetadata.mockReturnValueOnce([dependency]);
		mockProviderInjectorResolver.mockImplementation(() => ({}));

		const instance = ControllerInjector.resolve(target);

		expect(instance).toBeInstanceOf(target);
		expect(mockProviderInjectorResolver).toHaveBeenCalledWith(
			dependency,
			dependency.name,
			['dependency']
		);
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
		ProvidersRegistry.register({
			name: dependency.name,
			provider: dependency,
			instance: {},
		});
		mockGetMetadata.mockReturnValueOnce([dependency]);
		mockProviderInjectorResolver.mockImplementation(() => 'mockDependency');

		const instance = ControllerInjector.resolve(target) as InstanceType<
			typeof target
		>;

		expect(instance.dep).toBe('mockDependency');
	});
});
