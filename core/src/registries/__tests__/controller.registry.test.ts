import { describe, it, expect, afterEach } from 'vitest';
import { ControllersRegistry } from '../controller.registry';

describe('ControllersRegistry', () => {
	const TestController = class TestController {};
	const AnotherController = class AnotherController {};

	afterEach(() => {
		ControllersRegistry['store'].clear();
	});

	it('should register a controller with a null instance by default', () => {
		ControllersRegistry.register(TestController);

		const result = ControllersRegistry.get(TestController);

		expect(result).toEqual({ instance: null });
	});

	it('should register a controller with a provided instance', () => {
		const instance = new TestController();
		ControllersRegistry.register(TestController, instance);

		const result = ControllersRegistry.get(TestController);

		expect(result).toEqual({ instance });
	});

	it('should return undefined for a controller that is not registered', () => {
		const result = ControllersRegistry.get(TestController);
		expect(result).toBeUndefined();
	});

	it('should return all registered controller keys', () => {
		[TestController, AnotherController].forEach((controller) =>
			ControllersRegistry.register(controller)
		);

		const keys = ControllersRegistry.keys();

		expect(keys).toEqual([TestController, AnotherController]);
	});

	it('should overwrite an existing controller registration', () => {
		const firstInstance = { foo: 'bar' };
		const secondInstance = { baz: 'qux' };

		ControllersRegistry.register(TestController, firstInstance);
		ControllersRegistry.register(TestController, secondInstance);

		const result = ControllersRegistry.get(TestController);
		expect(result).toEqual({ instance: secondInstance });
	});
});
