import 'reflect-metadata';
import { MODULE_METADATA, PROVIDER_SCOPE_METADATA } from '@core/constants';
import { Module } from '@core/decorators';
import { Scope } from '@core/enums';

describe('Module Decorator', () => {
	it('should define MODULE_METADATA on the target', () => {
		const mockTarget = class {};
		const mockOptions = {};

		Module(mockOptions)(mockTarget);

		const hasModuleMetadata = Reflect.getMetadata(MODULE_METADATA, mockTarget);
		expect(hasModuleMetadata).toBe(true);
	});

	it('should define PROVIDER_SCOPE_METADATA with correct options on the target', () => {
		const mockTarget = class {};
		const mockOptions = Object.create({ customOption: 'test' });

		Module(mockOptions)(mockTarget);

		const providerScopeMetadata = Reflect.getMetadata(
			PROVIDER_SCOPE_METADATA,
			mockTarget
		);
		expect(providerScopeMetadata).toEqual({
			...mockOptions,
			type: 'module',
			scope: Scope.SINGLETON,
		});
	});

	it('should not modify the target class itself', () => {
		const mockTarget = class {
			static originalProperty = 'original';
		};
		const mockOptions = {};

		Module(mockOptions)(mockTarget);

		expect(mockTarget.originalProperty).toBe('original');
	});
});
