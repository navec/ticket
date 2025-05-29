import http from 'node:http';
import { HttpServerAdapter, ZodAdapter } from '@core/adapters';
import { HttpMethod, ValidatorType } from '@core/enums';
import { EndpointsRegistry } from '@core/registries';

jest.mock('@core/extractors/RequestParamsExtractor', () => ({
	RequestParamsExtractor: class {
		extract = () => Promise.resolve([]);
	},
}));

describe('HttpServerAdapter', () => {
	let serverAdapter: HttpServerAdapter;
	let createServerSpy: jest.SpyInstance;

	beforeEach(() => {
		createServerSpy = jest.spyOn(http, 'createServer');
		serverAdapter = new HttpServerAdapter();
	});

	it('should initialize the server', () => {
		expect(createServerSpy).toHaveBeenCalled();
	});

	it('should register a default middleware', () => {
		const middleware = jest.fn();

		serverAdapter.use(middleware);

		const expected = { type: 'default', handler: middleware };
		expect(serverAdapter['middlewares']).toContainEqual(expected);
	});

	it('should register a Zod validator middleware', () => {
		serverAdapter.useValidator(ValidatorType.ZOD);

		expect(serverAdapter['middlewares']).toContainEqual({
			type: 'validator',
			handler: new ZodAdapter().validate,
		});
	});

	it('should throw an error for unsupported validator types', () => {
		const validator = 'INVALID' as ValidatorType;

		const validatorCb = () => serverAdapter.useValidator(validator);

		expect(validatorCb).toThrow(
			'Validator type INVALID is not supported. Supported types are: ZOD'
		);
	});

	it('should start the server on the specified port', async () => {
		const listenMock = jest.fn((_, callback) => callback && callback());
		serverAdapter.serverInstance.listen = listenMock;

		await serverAdapter.listen(3000);

		expect(listenMock).toHaveBeenCalledWith(3000, undefined);
	});

	it('should handle unexpected errors during server startup', async () => {
		serverAdapter.serverInstance.listen = jest.fn(() => {
			throw new Error('Startup error');
		});

		await expect(serverAdapter.listen(3000)).rejects.toThrow(
			`[HttpServerAdapter.listen] ::  Unexpected error during server startup -> ${new Error('Startup error')}`
		);
	});

	it('should return a 404 response for unknown routes', async () => {
		const request = {
			url: '/test',
			headers: {},
			method: 'GET',
		} as http.IncomingMessage;
		const response = { setHeader: jest.fn(), finished: false, end: jest.fn() };

		serverAdapter.serverInstance.emit('request', request, response);

		expect(response.setHeader).toHaveBeenCalledWith(
			'Content-Type',
			'application/json'
		);

		const parsedResponse = JSON.parse(response.end.mock.calls[0][0]);
		expect(parsedResponse).toMatchObject({
			name: 'NotFoundException',
			statusCode: 404,
			message: '/test not found',
		});
	});

	it('should return success body response', async () => {
		const endpoint = {
			method: { bound: jest.fn(), name: 'test' },
			controller: { test: jest.fn() },
			type: HttpMethod.POST,
			path: '/test',
		};

		jest.spyOn(EndpointsRegistry, 'get').mockReturnValueOnce(endpoint);
		endpoint.method.bound.mockImplementationOnce(() => ({ name: 'test' }));

		const request = { url: '/test', headers: {}, method: 'POST' };
		const response = { setHeader: jest.fn(), finished: false, end: jest.fn() };
		jest.spyOn(response, 'end').mockImplementation((data) => data);

		await new Promise<void>((resolve) => {
			response.end.mockImplementation(() => {
				resolve();
				return response;
			});
			serverAdapter.serverInstance.emit('request', request, response);
		});

		expect(response.end).toHaveBeenCalledWith(JSON.stringify({ name: 'test' }));
		expect(response.setHeader).toHaveBeenCalledWith(
			'Content-Type',
			'application/json'
		);
	});
});
