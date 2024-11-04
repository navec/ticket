export interface IAppServerFactory {
  port: number | undefined;
  routes: Record<
    string,
    Record<string, {statusCode: HttpStatusCode; handler: Function}>
  >;

  listen(port: number, hostname: string): this;
  get(path: string, callback: Function, statusCode?: number): void;
  post(path: string, callback: Function, statusCode?: number): void;
  put(path: string, callback: Function, statusCode?: number): void;
  patch(path: string, callback: Function, statusCode?: number): void;
  delete(path: string, callback: Function, statusCode?: number): void;
}
