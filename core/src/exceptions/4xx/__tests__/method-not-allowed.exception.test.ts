import { describe, it, expect } from 'vitest';
import { MethodNotAllowedException } from '@core/exceptions';
import { HTTP_STATUS } from '@core/constants';

describe(MethodNotAllowedException.name, () => {
	it('should create an instance with default message and status code', () => {
		const exception = new MethodNotAllowedException();

		expect(exception.statusCode).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
		expect(exception.message).toBe('Method Not Allowed');
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with a custom message', () => {
		const customMessage = 'Custom Method Not Allowed Message';

		const exception = new MethodNotAllowedException(customMessage);

		expect(exception.statusCode).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
		expect(exception.message).toBe(customMessage);
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with custom details', () => {
		const details = { field: 'email', error: 'Custom error' };

		const exception = new MethodNotAllowedException('Custom error', details);

		expect(exception.statusCode).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
		expect(exception.message).toBe('Custom error');
		expect(exception.details).toEqual(details);
	});
});
