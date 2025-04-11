export abstract class Request {
  abstract get pathname(): string;
  abstract get query(): Record<string, any>;
  abstract get path(): Record<string, any>;
  abstract get headers(): Record<string, string>;
  abstract get body(): Record<string, any> | Promise<Record<string, any>>;
  abstract get cookies(): Record<string, string>;
  abstract get req(): {
    body: Record<string, any>;
    query: Record<string, any>;
    path: Record<string, any>;
    // cookies: Record<string, any>;
    headers: Record<string, string>;
  };
}
