import {describe, it, expect, vi, afterEach, Mock} from 'vitest';
import {ProviderScanner} from '../provider.scanner';
import {
  getMetadata,
  PROVIDER_SCOPE_METADATA,
  ProvidersRegistry,
} from 'core/src';

vi.mock('core/src', async importOriginal => {
  const actual = await importOriginal<typeof import('core/src')>();
  return {
    ...actual,
    getMetadata: vi.fn(),
    ProvidersRegistry: {register: vi.fn()},
  };
});

describe('ProviderScanner', () => {
  const getMetadataSpy = getMetadata as Mock;
  const Provider = class Provider {};

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register a provider if metadata type is "provider"', () => {
    getMetadataSpy.mockReturnValue({type: 'provider'});

    ProviderScanner.scan([Provider]);

    expect(ProvidersRegistry.register).toHaveBeenCalledWith(Provider);
    expect(getMetadataSpy).toHaveBeenCalledWith(
      PROVIDER_SCOPE_METADATA,
      Provider,
    );
  });

  it('should throw an error if metadata type is not "provider"', () => {
    getMetadataSpy.mockReturnValue({type: 'service'});

    const callback = () => ProviderScanner.scan([Provider]);

    expect(callback).toThrowError(
      'provider type is required, currently we have service type',
    );

    expect(getMetadataSpy).toHaveBeenCalledWith(
      PROVIDER_SCOPE_METADATA,
      Provider,
    );
    expect(ProvidersRegistry.register).not.toHaveBeenCalled();
  });
});
