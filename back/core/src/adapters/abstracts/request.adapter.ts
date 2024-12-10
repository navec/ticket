export abstract class Request {
  abstract get pathname(): string;
  abstract get query(): Record<string, any>;
  abstract get params(): Record<string, any>;
  abstract get headers(): Record<string, string>;
  abstract get body(): Record<string, any> | Promise<Record<string, any>>;
  abstract get all(): {
    body: Record<string, any>;
    query: Record<string, any>;
    params: Record<string, any>;
    headers: Record<string, string>;
  };
}
