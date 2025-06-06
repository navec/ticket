import { Server, createServer } from 'node:http';
import { ServerAdapter, ValidatorAdapter, ZodAdapter } from '@core/adapters';
import { HttpServerRequestAdapter } from './request.adapter';
import { HttpServerResponseAdapter } from './response.adapter';

import { EndpointsRegistry } from '@core/registries';
import {
	BadRequestException,
	HttpException,
	InternalServerException,
	NotFoundException,
} from '@core/exceptions';
import { DtoExtractor, RequestParamsExtractor } from '@core/extractors';
import { ValidatorType } from '@core/enums';

export class HttpServerAdapter extends ServerAdapter {
	private server: Server;
	private middlewares: {
		type: 'validator' | 'default';
		handler:
			| (<T = unknown>(
					req: HttpServerRequestAdapter,
					res: HttpServerResponseAdapter
			  ) => T)
			| ValidatorAdapter['validate'];
	}[] = [];

	constructor() {
		super();

		// console.log({ createServer });
		this.server = createServer(async (req, res) => {
			const request = new HttpServerRequestAdapter(req);
			const response = new HttpServerResponseAdapter(res);

			try {
				const endpoint = EndpointsRegistry.get(
					request.pathname,
					request.method
				);
				if (!endpoint) {
					response.send(new NotFoundException(`${request.pathname} not found`));
					return;
				}
				const [target, method] = [endpoint.controller, endpoint.method.name];

				const requestParamsExtractor = new RequestParamsExtractor({
					request,
					response,
					target,
					method,
				});

				const params = await requestParamsExtractor.extract();

				// Exécution des middlewares
				await Promise.all(
					this.middlewares.map(async ({ type, handler }) => {
						if (!response.finished) {
							if (type === 'validator') {
								const dtoExtractor = new DtoExtractor({ target, method });
								const schemas = dtoExtractor.extract();
								// TODO improve
								await (handler as ValidatorAdapter['validate'])(
									schemas,
									params
								);
							} else {
								await (
									handler as <T = unknown>(
										req: HttpServerRequestAdapter,
										res: HttpServerResponseAdapter
									) => T
								)(request, response);
							}
						}
					})
				);

				const data = await endpoint.method.bound(...params);
				response.send(data);
			} catch (error) {
				console.error(error);
				const isHttpException = error instanceof HttpException;
				response.send(isHttpException ? error : new InternalServerException());
			}
		});
	}

	use(
		middleware: <T = unknown>(
			req: HttpServerRequestAdapter,
			res: HttpServerResponseAdapter
		) => T
	): void {
		this.middlewares.push({ type: 'default', handler: middleware });
	}

	useValidator(validator: ValidatorType) {
		switch (validator) {
			case ValidatorType.ZOD:
				this.middlewares.push({
					type: 'validator',
					handler: new ZodAdapter().validate,
				});
				break;
			default:
				throw new BadRequestException(
					`Validator type ${validator} is not supported. Supported types are: ${Object.values(ValidatorType).join(', ')}`
				);
		}
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

	close(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.server.close((error) => {
				if (error) {
					const message = `[${HttpServerAdapter.name}.${this.close.name}] ::  Unexpected error during server shutdown -> ${error}`;
					reject(new Error(message));
				} else {
					resolve();
				}
			});
		});
	}

	get serverInstance(): Server {
		return this.server;
	}
}
