import { DESIGN_PARAM_TYPES } from '@core/constants';
import { ProviderInjector } from '@core/injectors';
import { ProvidersRegistry } from '@core/registries';
import { Constructor } from '@core/types';

const mockGetMetadata = jest.fn();
jest.mock('@core/decorators', () => ({
	...jest.requireActual('@core/decorators'),
	getMetadata: (...args: unknown[]) => mockGetMetadata(...args),
}));

describe(ProviderInjector.name, () => {
	const TestDependency: Constructor = class TestDependency {};
	const TestProvider: Constructor = class TestProvider {
		constructor(public dependency: InstanceType<typeof TestDependency>) {}
	};

	afterEach(mockGetMetadata.mockClear);

	it('should resolve a provider with no dependencies', () => {
		const NoDependencyProvider = class NoDependencyProvider {};
		ProvidersRegistry.register({
			name: NoDependencyProvider.name,
			provider: NoDependencyProvider,
			instance: null,
		});

		const instance = ProviderInjector.resolve(
			NoDependencyProvider,
			NoDependencyProvider.name
		);

		expect(instance).toBeInstanceOf(NoDependencyProvider);
		expect(mockGetMetadata).toHaveBeenCalledWith(
			DESIGN_PARAM_TYPES,
			NoDependencyProvider
		);
	});

	it('should resolve a provider with dependencies', () => {
		const dependencyInstance = new TestDependency();
		ProvidersRegistry.register({
			name: TestDependency.name,
			provider: TestDependency,
			instance: dependencyInstance,
		});
		ProvidersRegistry.register({
			name: TestProvider.name,
			provider: TestProvider,
			instance: new TestProvider(dependencyInstance),
		});

		const instance = ProviderInjector.resolve(
			TestProvider,
			TestProvider.name
		) as { dependency: unknown };

		expect(instance).toBeInstanceOf(TestProvider);
		expect(instance.dependency).toBeInstanceOf(TestDependency);
	});

	it('should throw an error if the provider is not in the accepted providers list', () => {
		class UnregisteredProvider {}

		expect(() =>
			ProviderInjector.resolve(UnregisteredProvider, UnregisteredProvider.name)
		).toThrow();
	});

	it('should throw an error if the provider is already resolved', () => {
		const TestProvider = class TestProvider {};
		ProvidersRegistry.register({
			name: TestProvider.name,
			provider: TestProvider,
			instance: null,
		});
		const alreadyResolved = new Set([TestProvider]);

		const callback = () =>
			ProviderInjector.resolve(
				TestProvider,
				TestProvider.name,
				ProvidersRegistry.keys(),
				alreadyResolved
			);
		expect(callback).toThrow();
	});

	it('should throw an error if the provider is not accepted in the registry', () => {
		const MissingProvider = class MissingProvider {};

		const callback = () =>
			ProviderInjector.resolve(MissingProvider, MissingProvider.name);

		expect(callback).toThrow(
			`Target ${MissingProvider.name} is not in the list of accepted providers.`
		);
	});

	it('should throw an error if the provider is a circular dependency', () => {
		const MissingProvider = class MissingProvider {};

		const callback = () =>
			ProviderInjector.resolve(
				MissingProvider,
				MissingProvider.name,
				[MissingProvider.name],
				new Set([MissingProvider])
			);

		expect(callback).toThrow(
			`Circular dependency detected while resolving ${MissingProvider.name}.`
		);
	});

	it('should throw an error if the provider is not found in the registry', () => {
		const MissingProvider = class MissingProvider {};

		const callback = () =>
			ProviderInjector.resolve(MissingProvider, MissingProvider.name, [
				MissingProvider.name,
			]);

		expect(callback).toThrow(`Provider not found for: ${MissingProvider}`);
	});

	it('should cache the resolved instance in the provider registry', () => {
		const TestProvider = class TestProvider {};
		ProvidersRegistry.register({
			name: TestDependency.name,
			provider: TestDependency,
			instance: null,
		});
		ProvidersRegistry.register({
			name: TestProvider.name,
			provider: TestProvider,
			instance: null,
		});

		const instance1 = ProviderInjector.resolve(TestProvider, TestProvider.name);
		const instance2 = ProviderInjector.resolve(TestProvider, TestProvider.name);

		expect(instance1).toBe(instance2);
		expect(mockGetMetadata).toHaveBeenCalledWith(
			DESIGN_PARAM_TYPES,
			TestProvider
		);
	});
});
