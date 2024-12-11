import { ServerResponse } from "node:http";
import { Response } from "../abstracts";

export class HttpServerResponseAdapter extends Response {
  constructor(private res: ServerResponse) {
    super();
  }

  setHeader(key: string, value: string): void {
    this.res.setHeader(key, value);
  }

  send(body: any, opt = {}): void {
    const { statusCode, format } = {
      statusCode: 200,
      format: "application/json",
      ...opt,
    };

    this.res.setHeader("Content-Type", format);
    this.res.statusCode = statusCode;
    this.res.end(JSON.stringify(body, null, 3));
  }
}
