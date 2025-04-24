import {
	Injector,
	Scanner,
	ServerAdapter,
	RouterRegistry,
	Constructor,
} from '..';

export class AppBuilder {
	private scanner: Scanner;
	private injector: Injector;
	private routerRegistry: RouterRegistry;

	private app: { server?: ServerAdapter; module?: Constructor };

	constructor() {
		this.scanner = new Scanner();
		this.injector = new Injector();
		this.routerRegistry = new RouterRegistry();

		this.app = {};
	}

	setModule(module: Constructor) {
		this.app.module = module;
		return this;
	}

	setServer(server: ServerAdapter) {
		this.app.server = server;
		return this;
	}

	build() {
		const { server, module } = this.app;
		if (!server || !module) {
			throw new Error('TODO add functional message');
		}

		this.scanner.scan(module);
		this.injector.inject(module);
		this.routerRegistry.register();
		return server;
	}
}
