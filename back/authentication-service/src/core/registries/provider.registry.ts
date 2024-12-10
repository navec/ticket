export class ProvidersRegistry {
  private static store = new Map();

  public static register(provider: any) {
    this.store.set(provider, {instance: null});
  }

  public static get(provider: any) {
    return this.store.get(provider);
  }

  public static keys() {
    return [...this.store.keys()];
  }
}
