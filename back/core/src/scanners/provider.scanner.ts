import {
  PROVIDER_SCOPE_METADATA,
  getMetadata,
  ProvidersRegistry,
  Constructor,
} from '..';

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
