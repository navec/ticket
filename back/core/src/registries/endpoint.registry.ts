export class EndpointsRegistry {
  private static store = new Map<
    string,
    { method: { bound: any; name: string }; controller: any; path: string }
  >();
  private static storeForVariblesPath = new Map<
    string,
    { method: { bound: any; name: string }; controller: any; path: string }
  >();

  public static register(
    path: string,
    target: { method: { bound: any; name: string }; controller: any }
  ) {
    const splitPath = path.split("/");

    const isVariablePath = splitPath.some((segment) => segment.startsWith(":"));
    if (isVariablePath) {
      const variablePathRegex = splitPath
        .map((segment) => (segment.startsWith(":") ? `([^/]+)` : segment))
        .join("/");
      this.storeForVariblesPath.set(variablePathRegex, { ...target, path });
    } else {
      this.store.set(path, { ...target, path });
    }
  }

  public static get(path: string) {
    if (this.store.has(path)) {
      return this.store.get(path);
    }

    const key = Array.from(this.storeForVariblesPath.keys()).find(
      (pattern: string) => {
        const regex = new RegExp(pattern);
        return regex.test(path);
      }
    );

    return key ? this.storeForVariblesPath.get(key) : null;
  }
}
