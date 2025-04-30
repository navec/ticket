import { PROVIDER_SCOPE_METADATA } from '@core/constants';
import { ProviderScanner } from '@core/scanners';

const mockGetMetadata = jest.fn();
jest.mock('@core/decorators', () => ({
	getMetadata: (...args: unknown[]) => mockGetMetadata(...args),
}));

const mockProvidersRegistry = jest.fn();
jest.mock('@core/registries', () => ({
	...jest.requireActual('@core/registries'),
	ProvidersRegistry: {
		register: (...args: unknown[]) => mockProvidersRegistry(...args),
	},
}));

describe('ProviderScanner', () => {
	const Provider = class Provider {};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should register a provider if metadata type is "provider"', () => {
		mockGetMetadata.mockReturnValue({ type: 'provider', name: Provider.name });

		ProviderScanner.scan([Provider]);

		expect(mockProvidersRegistry).toHaveBeenCalledWith({
			name: Provider.name,
			provider: Provider,
		});
		expect(mockGetMetadata).toHaveBeenCalledWith(
			PROVIDER_SCOPE_METADATA,
			Provider
		);
	});

	it('should throw an error if metadata type is not "provider"', () => {
		mockGetMetadata.mockReturnValue({ type: 'service' });

		const callback = () => ProviderScanner.scan([Provider]);

		expect(callback).toThrowError(
			'provider type is required, currently we have service type'
		);

		expect(mockGetMetadata).toHaveBeenCalledWith(
			PROVIDER_SCOPE_METADATA,
			Provider
		);
		expect(mockProvidersRegistry).not.toHaveBeenCalled();
	});
});
