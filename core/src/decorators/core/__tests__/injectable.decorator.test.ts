import 'reflect-metadata';
import { INJECTABLE_METADATA, PROVIDER_SCOPE_METADATA } from '@core/constants';
import { Injectable } from '@core/decorators';
import { Scope } from '@core/enums';

describe('Injectable Decorator', () => {
	it('should define metadata for injectable and provider scope', () => {
		class TestClass {}

		Injectable()(TestClass);

		const injectableMetadata = Reflect.getMetadata(
			INJECTABLE_METADATA,
			TestClass
		);
		const providerScopeMetadata = Reflect.getMetadata(
			PROVIDER_SCOPE_METADATA,
			TestClass
		);

		expect(injectableMetadata).toBe(true);
		expect(providerScopeMetadata).toEqual({
			name: TestClass.name,
			type: 'provider',
			scope: Scope.SINGLETON,
		});
	});
});
