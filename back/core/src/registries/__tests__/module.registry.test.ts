import { describe, it, expect } from 'vitest';
import { ModulesRegistry } from '../module.registry';

describe('ModulesRegistry', () => {
	const TestModule = class TestModule {};

	it('should register a module with a null instance by default', () => {
		ModulesRegistry.register(TestModule);

		const result = ModulesRegistry.get(TestModule);

		expect(result).toEqual({ instance: null });
	});

	it('should register a module with a provided instance', () => {
		const instance = new TestModule();
		ModulesRegistry.register(TestModule, instance);

		const result = ModulesRegistry.get(TestModule);

		expect(result).toEqual({ instance });
	});

	it('should return undefined for unregistered modules', () => {
		const UnregisteredModule = class UnregisteredModule {};

		const result = ModulesRegistry.get(UnregisteredModule);

		expect(result).toBeUndefined();
	});
});
