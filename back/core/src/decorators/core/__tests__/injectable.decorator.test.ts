import {describe, it, expect} from 'vitest';
import {
  Injectable,
  INJECTABLE_METADATA,
  PROVIDER_SCOPE_METADATA,
  Scope,
} from 'core/src';

describe('Injectable Decorator', () => {
  it('should define metadata for injectable and provider scope', () => {
    class TestClass {}

    Injectable()(TestClass);

    const injectableMetadata = Reflect.getMetadata(
      INJECTABLE_METADATA,
      TestClass,
    );
    const providerScopeMetadata = Reflect.getMetadata(
      PROVIDER_SCOPE_METADATA,
      TestClass,
    );

    expect(injectableMetadata).toBe(true);
    expect(providerScopeMetadata).toEqual({
      type: 'provider',
      scope: Scope.SINGLETON,
    });
  });
});
