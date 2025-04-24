import { describe, it, expect } from 'vitest';
import { BadRequestException } from '..';
import { HTTP_STATUS } from '../../../../src/constants';

describe(BadRequestException.name, () => {
	it('should create an instance with default message and status code', () => {
		const exception = new BadRequestException();

		expect(exception.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
		expect(exception.message).toBe('Bad Request');
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with a custom message', () => {
		const customMessage = 'Custom Bad Request Message';

		const exception = new BadRequestException(customMessage);

		expect(exception.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
		expect(exception.message).toBe(customMessage);
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with custom details', () => {
		const details = { field: 'email', error: 'Custom error' };

		const exception = new BadRequestException('Custom error', details);

		expect(exception.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
		expect(exception.message).toBe('Custom error');
		expect(exception.details).toEqual(details);
	});
});
