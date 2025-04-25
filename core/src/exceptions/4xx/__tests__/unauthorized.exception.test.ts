import { describe, it, expect } from 'vitest';
import { UnauthorizedException } from '@core/exceptions';
import { HTTP_STATUS } from '@core/constants';

describe(UnauthorizedException.name, () => {
	it('should create an instance with default message and status code', () => {
		const exception = new UnauthorizedException();

		expect(exception.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
		expect(exception.message).toBe('Unauthorized');
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with a custom message', () => {
		const customMessage = 'Custom Unauthorized Message';

		const exception = new UnauthorizedException(customMessage);

		expect(exception.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
		expect(exception.message).toBe(customMessage);
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with custom details', () => {
		const details = { field: 'email', error: 'Custom error' };

		const exception = new UnauthorizedException('Custom error', details);

		expect(exception.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
		expect(exception.message).toBe('Custom error');
		expect(exception.details).toEqual(details);
	});
});
