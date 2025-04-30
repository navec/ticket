import { HttpException } from '@core/exceptions';

describe(HttpException.name, () => {
	it('should create an instance with the correct properties', () => {
		const statusCode = 404;
		const message = 'Not Found';
		const details = { resource: 'User' };

		const exception = new HttpException(statusCode, message, details);

		expect(exception).toBeInstanceOf(HttpException);
		expect(exception.statusCode).toBe(statusCode);
		expect(exception.message).toBe(message);
		expect(exception.details).toEqual(details);
		expect(exception.name).toBe('HttpException');
	});

	it('should capture the stack trace if available', () => {
		const exception = new HttpException(500, 'Internal Server Error');
		expect(exception.stack).toBeDefined();
	});

	it('should return a correct JSON representation', () => {
		const statusCode = 400;
		const message = 'Bad Request';
		const details = { field: 'email' };

		const exception = new HttpException(statusCode, message, details);
		const json = exception.toJSON();

		expect(json).toEqual({
			name: 'HttpException',
			statusCode,
			message,
			details,
			stack: exception.stack,
		});
	});

	it('should return a correct JSON string representation', () => {
		const statusCode = 401;
		const message = 'Unauthorized';
		const details = { reason: 'Invalid token' };

		const exception = new HttpException(statusCode, message, details);
		const jsonString = exception.toJSONString();

		expect(jsonString).toBe(
			JSON.stringify(
				{
					name: 'HttpException',
					statusCode,
					message,
					details,
					stack: exception.stack,
				},
				null,
				2
			)
		);
	});

	it('should handle undefined details', () => {
		const statusCode = 403;
		const message = 'Forbidden';

		const exception = new HttpException(statusCode, message);

		expect(exception.details).toBeUndefined();
		const json = exception.toJSON();
		expect(json.details).toBeUndefined();
	});
});
