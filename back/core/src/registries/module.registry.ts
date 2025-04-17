import {Constructor} from '../types';

export class ModulesRegistry {
  private static store = new Map<Constructor, {instance: unknown | null}>();

  public static register(module: Constructor) {
    this.store.set(module, {instance: null});
  }

  public static get(module: Constructor) {
    return this.store.get(module);
  }
}
