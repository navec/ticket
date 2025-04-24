import { describe, it, expect } from 'vitest';
import { ServiceUnavailableException } from '..';
import { HTTP_STATUS } from '../../../constants';

describe(ServiceUnavailableException.name, () => {
	it('should create an instance with default message and status code', () => {
		const exception = new ServiceUnavailableException();

		expect(exception.statusCode).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
		expect(exception.message).toBe('Service Unavailable');
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with a custom message', () => {
		const customMessage = 'Custom Service Unavailable Message';

		const exception = new ServiceUnavailableException(customMessage);

		expect(exception.statusCode).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
		expect(exception.message).toBe(customMessage);
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with custom details', () => {
		const details = { field: 'email', error: 'Custom error' };

		const exception = new ServiceUnavailableException('Custom error', details);

		expect(exception.statusCode).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
		expect(exception.message).toBe('Custom error');
		expect(exception.details).toEqual(details);
	});
});
