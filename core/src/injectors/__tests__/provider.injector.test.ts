import { describe, it, expect } from 'vitest';
import { Constructor } from '@core/types';
import { ProvidersRegistry } from '@core/registries';
import { ProviderInjector } from '../provider.injector';

describe('ProviderInjector', () => {
	const TestDependency: Constructor = class TestDependency {};
	const TestProvider: Constructor = class TestProvider {
		constructor(public dependency: InstanceType<typeof TestDependency>) {}
	};

	it('should resolve a provider with no dependencies', () => {
		const NoDependencyProvider = class NoDependencyProvider {};
		ProvidersRegistry.register(NoDependencyProvider, null);

		const instance = ProviderInjector.resolve(NoDependencyProvider);

		expect(instance).toBeInstanceOf(NoDependencyProvider);
	});

	it('should resolve a provider with dependencies', () => {
		const dependencyInstance = new TestDependency();
		ProvidersRegistry.register(TestDependency, dependencyInstance);
		ProvidersRegistry.register(
			TestProvider,
			new TestProvider(dependencyInstance)
		);

		const instance = ProviderInjector.resolve(TestProvider) as {
			dependency: unknown;
		};

		expect(instance).toBeInstanceOf(TestProvider);
		expect(instance.dependency).toBeInstanceOf(TestDependency);
	});

	it('should throw an error if the provider is not in the accepted providers list', () => {
		class UnregisteredProvider {}

		expect(() => ProviderInjector.resolve(UnregisteredProvider)).toThrow();
	});

	it('should throw an error if the provider is already resolved', () => {
		const TestProvider = class TestProvider {};
		ProvidersRegistry.register(TestProvider, { instance: null });
		const alreadyResolved = new Set([TestProvider]);

		const callback = () =>
			ProviderInjector.resolve(
				TestProvider,
				ProvidersRegistry.keys(),
				alreadyResolved
			);
		expect(callback).toThrow();
	});

	it('should throw an error if the provider is not accepted in the registry', () => {
		const MissingProvider = class MissingProvider {};

		const callback = () => ProviderInjector.resolve(MissingProvider);

		expect(callback).toThrow(
			`Target ${MissingProvider.name} is not in the list of accepted providers.`
		);
	});

	it('should throw an error if the provider is a circular dependency', () => {
		const MissingProvider = class MissingProvider {};

		const callback = () =>
			ProviderInjector.resolve(
				MissingProvider,
				[MissingProvider],
				new Set([MissingProvider])
			);

		expect(callback).toThrow(
			`Circular dependency detected while resolving ${MissingProvider.name}.`
		);
	});

	it('should throw an error if the provider is not found in the registry', () => {
		const MissingProvider = class MissingProvider {};

		const callback = () =>
			ProviderInjector.resolve(MissingProvider, [MissingProvider]);

		expect(callback).toThrow(`Provider not found for: ${MissingProvider}`);
	});

	it('should cache the resolved instance in the provider registry', () => {
		const TestProvider = class TestProvider {};
		ProvidersRegistry.register(TestDependency, null);
		ProvidersRegistry.register(TestProvider, null);

		const instance1 = ProviderInjector.resolve(TestProvider);
		const instance2 = ProviderInjector.resolve(TestProvider);

		expect(instance1).toBe(instance2);
	});
});
