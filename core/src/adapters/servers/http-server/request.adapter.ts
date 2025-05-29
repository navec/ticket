import { IncomingMessage } from 'node:http';
import { Request } from '@core/adapters';
import { EndpointsRegistry } from '@core/registries';
import { BadRequestException } from '@core/exceptions';
import { HttpMethod } from '@core/enums';
import { URL } from 'url';

export class HttpServerRequestAdapter extends Request {
	private url: URL;

	constructor(private request: IncomingMessage) {
		super();
		this.url = new URL(request.url || '', `http://${request.headers.host}`);
	}

	get method(): HttpMethod {
		const httpMethod =
			HttpMethod[this.request.method as keyof typeof HttpMethod];
		if (httpMethod === undefined) {
			throw new BadRequestException(
				`Invalid HTTP method: ${this.request.method}`
			);
		}
		return httpMethod;
	}

	get pathname(): string {
		return this.url.pathname;
	}

	get body(): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			let bodyParamsString = '';
			this.request.on('data', (chunk) => (bodyParamsString += chunk));

			return this.request.on('end', () => {
				try {
					resolve(bodyParamsString.length ? JSON.parse(bodyParamsString) : {});
				} catch (error) {
					reject(new BadRequestException('Invalid JSON body', error));
				}
			});
		});
	}

	get query() {
		return Object.fromEntries(this.url.searchParams.entries());
	}

	get path() {
		const endpoint = EndpointsRegistry.get(this.url.pathname, this.method);
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

	get cookies(): Record<string, string> {
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
			{}
		);
	}
}
