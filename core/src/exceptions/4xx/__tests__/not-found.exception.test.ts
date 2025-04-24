import { describe, it, expect } from 'vitest';
import { NotFoundException } from '..';
import { HTTP_STATUS } from '../../../constants';

describe(NotFoundException.name, () => {
	it('should create an instance with default message and status code', () => {
		const exception = new NotFoundException();

		expect(exception.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
		expect(exception.message).toBe('Not Found');
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with a custom message', () => {
		const customMessage = 'Custom Not Found Message';

		const exception = new NotFoundException(customMessage);

		expect(exception.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
		expect(exception.message).toBe(customMessage);
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with custom details', () => {
		const details = { field: 'email', error: 'Custom error' };

		const exception = new NotFoundException('Custom error', details);

		expect(exception.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
		expect(exception.message).toBe('Custom error');
		expect(exception.details).toEqual(details);
	});
});
