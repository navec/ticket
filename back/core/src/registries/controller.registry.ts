import {Constructor} from '../types';

export class ControllersRegistry {
  private static store = new Map<Constructor, {instance: unknown | null}>();

  public static register(
    controller: Constructor,
    instance: unknown | null = null,
  ) {
    this.store.set(controller, {instance});
  }

  public static get(controller: Constructor) {
    return this.store.get(controller);
  }

  public static keys() {
    return Array.from(this.store.keys());
  }
}
