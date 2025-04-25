import { HttpServerRequestAdapter } from '@core/adapters/servers/http-server/request.adapter';
import { HttpServerResponseAdapter } from '@core/adapters/servers/http-server/response.adapter';

export abstract class MiddlewareAdapter {
	abstract use(
		req: HttpServerRequestAdapter,
		res: HttpServerResponseAdapter
	): void;
}
