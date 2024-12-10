import {ServerResponse} from 'node:http';
import {Response} from '../abstracts';

export class HttpServerResponseAdapter extends Response {
  constructor(private res: ServerResponse) {
    super();
  }

  setHeader(key: string, value: string): void {
    this.res.setHeader(key, value);
  }

  send(body: any, opt = {statusCode: 200, format: 'application/json'}): void {
    this.res.setHeader('Content-Type', opt.format);
    this.res.statusCode = opt.statusCode;
    this.res.end(JSON.stringify(body, null, 3));
  }
}
