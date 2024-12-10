import http, {Server} from 'node:http';
import {ServerAdapter, Request, Response} from '../abstracts';
import {HttpServerRequestAdapter} from './request.adapter';
import {HttpServerResponseAdapter} from './response.adapter';
import {RouterResolver} from 'src/core/routers/router-resolver';
import {resolve} from 'node:path';

export class HttpServerAdapter extends ServerAdapter {
  private server: Server;

  constructor() {
    super();
    const routerResolver = new RouterResolver();
    this.server = http.createServer(async (req, res) => {
      const request = new HttpServerRequestAdapter(req);
      const response = new HttpServerResponseAdapter(res);
      await routerResolver.resolve(request, response);
    });
  }

  use(middleware: Function): void {
    throw new Error('Method not implemented.');
  }

  async listen(port: number, callback?: () => void): Promise<ServerAdapter> {
    await new Promise((resolve, reject) => {
      try {
        resolve(this.server.listen(port, callback));
      } catch (error) {
        const message = `[${HttpServerAdapter.name}.${this.listen.name}] ::  Unexpected error during server startup -> ${error}`;
        reject(new Error(message));
      }
    });
    return this;
  }
}
