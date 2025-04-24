import { describe, it, expect } from 'vitest';
import { ForbiddenException } from '..';
import { HTTP_STATUS } from '../../../constants';

describe(ForbiddenException.name, () => {
	it('should create an instance with default message and status code', () => {
		const exception = new ForbiddenException();

		expect(exception.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
		expect(exception.message).toBe('Forbidden');
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with a custom message', () => {
		const customMessage = 'Custom Forbidden Message';

		const exception = new ForbiddenException(customMessage);

		expect(exception.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
		expect(exception.message).toBe(customMessage);
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with custom details', () => {
		const details = { field: 'email', error: 'Custom error' };

		const exception = new ForbiddenException('Custom error', details);

		expect(exception.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
		expect(exception.message).toBe('Custom error');
		expect(exception.details).toEqual(details);
	});
});
