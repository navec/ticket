import { PROVIDER_SCOPE_METADATA } from '@core/constants';
import { getMetadata } from '@core/decorators';
import { ProvidersRegistry } from '@core/registries';
import { Constructor } from '@core/types';

export class ProviderScanner {
	public static scan(providers: Constructor[]) {
		providers.forEach((provider: Constructor) => {
			const metadata = getMetadata(PROVIDER_SCOPE_METADATA, provider);
			if (metadata.type !== 'provider') {
				const message = `provider type is required, currently we have ${metadata.type} type`;
				throw new Error(message);
			}

			ProvidersRegistry.register(provider);
		});
	}
}
