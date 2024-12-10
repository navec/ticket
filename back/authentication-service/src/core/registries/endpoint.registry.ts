export class EndpointsRegistry {
  private static store = new Map();

  public static register(path: string, target: {method: any; controller: any}) {
    this.store.set(path, target);
  }

  public static get(path: string) {
    return this.store.get(path);
  }
}
