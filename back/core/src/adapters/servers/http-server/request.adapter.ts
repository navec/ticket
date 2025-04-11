import {IncomingMessage} from 'node:http';
import {Request} from '../../abstracts';
import {EndpointsRegistry} from '../../../registries';

export class HttpServerRequestAdapter extends Request {
  private url: URL;

  constructor(private request: IncomingMessage) {
    super();
    this.url = new URL(request.url || '', `http://${request.headers.host}`);
  }

  get pathname(): string {
    return this.url.pathname;
  }

  get body(): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      let bodyParamsString = '';
      this.request.on('data', chunk => (bodyParamsString += chunk));

      return this.request.on('end', () => {
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

  get path(): Record<string, any> {
    const endpoint = EndpointsRegistry.get(this.url.pathname);
    if (!endpoint) {
      return {};
    }

    const pathSegments = this.url.pathname.split('/');
    const routeVariablesMap = endpoint.path
      .split('/')
      .reduce((acc: Map<string, string>, segment: string, index: number) => {
        if (segment.startsWith(':')) {
          acc.set(segment.substring(1), pathSegments[index]);
        }
        return acc;
      }, new Map());
    return Object.fromEntries(routeVariablesMap.entries());
  }

  get cookies(): Record<string, any> {
    throw new Error('Method not implemented.');
  }

  get raw(): IncomingMessage {
    return this.request;
  }

  get headers(): Record<string, string> {
    return Object.entries(this.request.headers).reduce(
      (headers: Record<string, string>, [key, value]) => {
        const isList = Array.isArray(value);
        headers[key.toLowerCase()] = isList ? value.join(', ') : value || '';
        return headers;
      },
      {},
    );
  }

  get req(): {
    body: Record<string, any>;
    query: Record<string, any>;
    path: Record<string, any>;
    headers: Record<string, string>;
  } {
    const {body, query, path, headers} = this;
    return {body, query, headers, path};
  }
}
