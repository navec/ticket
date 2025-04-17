export abstract class Response {
  abstract setHeader(key: string, value: string): void;
  abstract send(
    body: unknown,
    option?: {format?: string; statusCode?: number},
  ): void;
}
