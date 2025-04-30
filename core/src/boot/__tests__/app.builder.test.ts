import { AppBuilder } from '@core/boot';

const mockScannerScan = jest.fn();
jest.mock('@core/scanners', () => ({
	Scanner: class {
		scan = (...args: unknown[]) => mockScannerScan(...args);
	},
}));

const mockInjectorInject = jest.fn();
jest.mock('@core/injectors', () => ({
	Injector: class {
		inject = (...args: unknown[]) => mockInjectorInject(...args);
	},
}));

const mockRouterRegistryRegister = jest.fn();
jest.mock('@core/routers', () => ({
	RouterRegistry: class {
		register = (...args: unknown[]) => mockRouterRegistryRegister(...args);
	},
}));

describe(AppBuilder.name, () => {
	let appBuilder: AppBuilder;

	beforeEach(() => {
		appBuilder = new AppBuilder();
	});

	it('should set the module correctly', () => {
		const mockModule = Object.create({});

		appBuilder.setModule(mockModule);

		expect(appBuilder['app'].module).toBe(mockModule);
	});

	it('should set the server correctly', () => {
		const mockServer = Object.create({});

		appBuilder.setServer(mockServer);

		expect(appBuilder['app'].server).toBe(mockServer);
	});

	it('should throw an error if build is called without a server', () => {
		const mockModule = Object.create({});

		appBuilder.setModule(mockModule);

		expect(() => appBuilder.build()).toThrowError(
			'TODO add functional message'
		);
	});

	it('should throw an error if build is called without a module', () => {
		const mockServer = Object.create({});

		appBuilder.setServer(mockServer);

		expect(() => appBuilder.build()).toThrowError(
			'TODO add functional message'
		);
	});

	it('should call scanner, injector, and routerRegistry methods during build', () => {
		const mockModule = Object.create({});
		const mockServer = Object.create({});

		const result = appBuilder
			.setModule(mockModule)
			.setServer(mockServer)
			.build();

		expect(mockScannerScan).toHaveBeenCalledWith(mockModule);
		expect(mockInjectorInject).toHaveBeenCalledWith(mockModule);
		expect(mockRouterRegistryRegister).toHaveBeenCalled();
		expect(result).toBe(mockServer);
	});
});
