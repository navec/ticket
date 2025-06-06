import { ServerResponse } from 'node:http';
import { HttpServerResponseAdapter } from '@core/adapters';
import { HttpException } from '@core/exceptions';

describe(HttpServerResponseAdapter.name, () => {
	it('should set a header on the response', () => {
		const mockRes = { setHeader: jest.fn() } as unknown as ServerResponse;
		const adapter = new HttpServerResponseAdapter(mockRes);

		adapter.setHeader('Content-Type', 'application/json');

		expect(mockRes.setHeader).toHaveBeenCalledWith(
			'Content-Type',
			'application/json'
		);
	});

	it('should send a JSON response with HttpException', () => {
		const mockRes = {
			setHeader: jest.fn(),
			end: jest.fn(),
			statusCode: 0,
		} as unknown as ServerResponse;
		const adapter = new HttpServerResponseAdapter(mockRes);
		const exception = new HttpException(404, 'Not Found');

		adapter.send(exception);

		expect(mockRes.setHeader).toHaveBeenCalledWith(
			'Content-Type',
			'application/json'
		);
		expect(mockRes.statusCode).toBe(404);
		expect(mockRes.end).toHaveBeenCalledWith(exception.toJSONString());
	});

	it('should send a JSON response with a plain object', () => {
		const mockRes = {
			setHeader: jest.fn(),
			end: jest.fn(),
		} as unknown as ServerResponse;
		const adapter = new HttpServerResponseAdapter(mockRes);
		const body = { message: 'Success' };

		adapter.send(body);

		expect(mockRes.setHeader).toHaveBeenCalledWith(
			'Content-Type',
			'application/json'
		);
		expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify(body));
	});

	it('should return true if the response is finished', () => {
		const mockRes = { writableEnded: true } as unknown as ServerResponse;
		const adapter = new HttpServerResponseAdapter(mockRes);

		expect(adapter.finished).toBe(true);
	});

	it('should return false if the response is not finished', () => {
		const mockRes = { writableEnded: false } as unknown as ServerResponse;
		const adapter = new HttpServerResponseAdapter(mockRes);

		expect(adapter.finished).toBe(false);
	});
});
