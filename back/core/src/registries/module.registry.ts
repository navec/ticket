export class ModulesRegistry {
  private static store = new Map();

  public static register(module: any) {
    this.store.set(module, {instance: null});
  }

  public static get(module: any) {
    return this.store.get(module);
  }
}
