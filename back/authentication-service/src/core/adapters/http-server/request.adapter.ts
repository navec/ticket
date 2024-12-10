import {IncomingMessage} from 'node:http';
import {Request} from '../abstracts';

export class HttpServerRequestAdapter extends Request {
  private url: URL;

  constructor(private req: IncomingMessage) {
    super();
    this.url = new URL(req.url || '', `http://${req.headers.host}`);
  }

  get pathname(): string {
    return this.url.pathname;
  }

  get body(): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      let bodyParamsString = '';
      this.req.on('data', chunk => (bodyParamsString += chunk));

      return this.req.on('end', () => {
        try {
          resolve(bodyParamsString.length ? JSON.parse(bodyParamsString) : {});
        } catch (err: any) {
          reject(new Error(`Invalid JSON body: ${err.message}`));
        }
      });
    });
  }

  get query(): Record<string, any> {
    return Object.fromEntries(this.url.searchParams.entries()) || {};
  }

  get params(): Record<string, any> {
    throw new Error('Method not implemented.');
  }

  get headers(): Record<string, string> {
    return Object.entries(this.req.headers).reduce(
      (headers: Record<string, string>, [key, value]) => {
        const isList = Array.isArray(value);
        headers[key.toLowerCase()] = isList ? value.join(', ') : value || '';
        return headers;
      },
      {}
    );
  }

  get all(): {
    body: Record<string, any>;
    query: Record<string, any>;
    params: Record<string, any>;
    headers: Record<string, string>;
  } {
    const {body, query, params, headers} = this;
    return {body, query, params, headers};
  }
}
