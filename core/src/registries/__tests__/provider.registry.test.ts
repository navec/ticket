import { describe, it, expect, afterEach } from 'vitest';
import { ProvidersRegistry } from '@core/registries';

describe('ProvidersRegistry', () => {
	const TestProvider = class TestProvider {};
	const AnotherProvider = class AnotherProvider {};

	afterEach(() => {
		ProvidersRegistry['store'].clear();
	});

	it('should register a provider with a null instance by default', () => {
		ProvidersRegistry.register(TestProvider);

		const result = ProvidersRegistry.get(TestProvider);
		expect(result).toEqual({ instance: null });
	});

	it('should register a provider with a specific instance', () => {
		const instance = new TestProvider();
		ProvidersRegistry.register(TestProvider, instance);

		const result = ProvidersRegistry.get(TestProvider);
		expect(result).toEqual({ instance });
	});

	it('should return undefined for unregistered providers', () => {
		const result = ProvidersRegistry.get(TestProvider);
		expect(result).toBeUndefined();
	});

	it('should return all registered provider keys', () => {
		ProvidersRegistry.register(TestProvider);
		ProvidersRegistry.register(AnotherProvider);

		const keys = ProvidersRegistry.keys();
		expect(keys).toEqual([TestProvider, AnotherProvider]);
	});

	it('should overwrite an existing provider when re-registered', () => {
		const firstInstance = { foo: 'bar' };
		const secondInstance = { baz: 'qux' };

		ProvidersRegistry.register(TestProvider, firstInstance);
		ProvidersRegistry.register(TestProvider, secondInstance);

		const result = ProvidersRegistry.get(TestProvider);
		expect(result).toEqual({ instance: secondInstance });
	});
});
