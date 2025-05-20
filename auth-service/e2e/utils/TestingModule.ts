import {
	AppBootFactory,
	ValidatorType,
	Constructor,
	ServerAdapter,
	InternalServerException,
} from '@ticket/core';
import { getHttpPort } from './getHttpPort';

export class TestingModule {
	private app: ServerAdapter | undefined;
	private port: number | undefined;

	constructor(private readonly module: Constructor) {}

	public async init(opts: { validator?: ValidatorType }): Promise<void> {
		this.app = await AppBootFactory.create(this.module);
		if (opts.validator) {
			this.app.useValidator(ValidatorType.ZOD);
		}

		const port = await getHttpPort();
		await this.app.listen(port, () => {
			console.log(`[TEST] : Server running at http://localhost:${port}/`);
		});
	}

	public async close(): Promise<void> {
		if (!this.app) {
			throw new InternalServerException('App is not initialized');
		}
		await this.app.close();
	}

	public getInstance<T>(): T {
		if (!this.app) {
			throw new InternalServerException('App is not initialized');
		}
		return this.app.serverInstance as T;
	}

	public getPort(): number {
		if (!this.port) {
			throw new InternalServerException('Port is not initialized');
		}
		return this.port;
	}
}
