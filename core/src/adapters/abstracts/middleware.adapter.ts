import {
	HttpServerRequestAdapter,
	HttpServerResponseAdapter,
} from '@core/adapters';

export abstract class MiddlewareAdapter {
	abstract use(
		req: HttpServerRequestAdapter,
		res: HttpServerResponseAdapter
	): void;
}
