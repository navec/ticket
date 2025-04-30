import { ProvidersRegistry } from '@core/registries';

describe(ProvidersRegistry.name, () => {
	const TestProvider = class TestProvider {};
	const AnotherProvider = class AnotherProvider {};

	afterEach(() => {
		ProvidersRegistry['store'].clear();
	});

	it('should register a provider with a null instance by default', () => {
		ProvidersRegistry.register({
			name: TestProvider.name,
			provider: TestProvider,
		});

		const result = ProvidersRegistry.get(TestProvider.name);
		expect(result).toEqual({ constructor: TestProvider, instance: null });
	});

	it('should register a provider with a specific instance', () => {
		const instance = new TestProvider();
		ProvidersRegistry.register({
			name: TestProvider.name,
			provider: TestProvider,
			instance,
		});

		const result = ProvidersRegistry.get(TestProvider.name);
		expect(result).toEqual({ constructor: TestProvider, instance });
	});

	it('should return undefined for unregistered providers', () => {
		const result = ProvidersRegistry.get(TestProvider.name);
		expect(result).toBeUndefined();
	});

	it('should return all registered provider keys', () => {
		ProvidersRegistry.register({
			name: TestProvider.name,
			provider: TestProvider,
		});
		ProvidersRegistry.register({
			name: AnotherProvider.name,
			provider: AnotherProvider,
		});

		const keys = ProvidersRegistry.keys();
		expect(keys).toEqual([TestProvider.name, AnotherProvider.name]);
	});

	it('should overwrite an existing provider when re-registered', () => {
		const firstInstance = { foo: 'bar' };
		const secondInstance = { baz: 'qux' };

		ProvidersRegistry.register({
			name: TestProvider.name,
			provider: TestProvider,
			instance: firstInstance,
		});
		ProvidersRegistry.register({
			name: TestProvider.name,
			provider: TestProvider,
			instance: secondInstance,
		});

		const result = ProvidersRegistry.get(TestProvider.name);
		expect(result).toEqual({
			constructor: TestProvider,
			instance: secondInstance,
		});
	});
});
