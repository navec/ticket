import {ServerResponse} from 'node:http';
import {Response} from '../../abstracts';
import {HttpException} from '../../../exceptions';

export class HttpServerResponseAdapter extends Response {
  constructor(private res: ServerResponse) {
    super();
  }

  setHeader(key: string, value: string): void {
    this.res.setHeader(key, value);
  }

  send(body: HttpException): void {
    this.res.setHeader('Content-Type', 'application/json');
    this.res.statusCode = body.statusCode;
    this.res.end(body.toJSONString());
  }

  get finished(): boolean {
    return this.res.writableEnded;
  }
}
