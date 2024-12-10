import {PROVIDER_SCOPE_METADATA, getMetadata, ProvidersRegistry} from '..';

export class ProviderScanner {
  public static scan(providers: any[]) {
    providers.forEach((provider: any) => {
      const metadata = getMetadata(PROVIDER_SCOPE_METADATA, provider);
      if (metadata.type !== 'provider') {
        const message = `provider type is required, currently we have ${metadata.type} type`;
        throw new Error(message);
      }

      ProvidersRegistry.register(provider);
    });
  }
}
