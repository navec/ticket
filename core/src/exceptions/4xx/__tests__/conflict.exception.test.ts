import { describe, it, expect } from 'vitest';
import { ConflictException } from '@core/exceptions';
import { HTTP_STATUS } from '@core/constants';

describe(ConflictException.name, () => {
	it('should create an instance with default message and status code', () => {
		const exception = new ConflictException();

		expect(exception.statusCode).toBe(HTTP_STATUS.CONFLICT);
		expect(exception.message).toBe('Conflict');
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with a custom message', () => {
		const customMessage = 'Custom Conflict Message';

		const exception = new ConflictException(customMessage);

		expect(exception.statusCode).toBe(HTTP_STATUS.CONFLICT);
		expect(exception.message).toBe(customMessage);
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with custom details', () => {
		const details = { field: 'email', error: 'Custom error' };

		const exception = new ConflictException('Custom error', details);

		expect(exception.statusCode).toBe(HTTP_STATUS.CONFLICT);
		expect(exception.message).toBe('Custom error');
		expect(exception.details).toEqual(details);
	});
});
