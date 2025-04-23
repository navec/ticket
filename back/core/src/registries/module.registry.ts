import {Constructor} from '../types';

export class ModulesRegistry {
  private static store = new Map<Constructor, {instance: unknown | null}>();

  public static register(module: Constructor, instance: unknown | null = null) {
    this.store.set(module, {instance});
  }

  public static get(module: Constructor) {
    return this.store.get(module);
  }
}
