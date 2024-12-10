export class ControllersRegistry {
  private static store = new Map();

  public static register(controller: any) {
    this.store.set(controller, {instance: null});
  }

  public static get(controller: any) {
    return this.store.get(controller);
  }

  public static keys() {
    return [...this.store.keys()];
  }
}
