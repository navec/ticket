import {Constructor} from '..';

export class ProvidersRegistry {
  private static store = new Map<Constructor, {instance: unknown | null}>();

  public static register(provider: Constructor) {
    this.store.set(provider, {instance: null});
  }

  public static get(provider: Constructor) {
    return this.store.get(provider);
  }

  public static keys() {
    return Array.from(this.store.keys());
  }
}
