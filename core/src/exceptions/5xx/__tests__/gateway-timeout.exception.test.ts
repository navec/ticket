import { describe, it, expect } from 'vitest';
import { GatewayTimeoutException } from '@core/exceptions';
import { HTTP_STATUS } from '@core/constants';

describe(GatewayTimeoutException.name, () => {
	it('should create an instance with default message and status code', () => {
		const exception = new GatewayTimeoutException();

		expect(exception.statusCode).toBe(HTTP_STATUS.GATEWAY_TIMEOUT);
		expect(exception.message).toBe('Gateway Timeout');
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with a custom message', () => {
		const customMessage = 'Custom Gateway Timeout Message';

		const exception = new GatewayTimeoutException(customMessage);

		expect(exception.statusCode).toBe(HTTP_STATUS.GATEWAY_TIMEOUT);
		expect(exception.message).toBe(customMessage);
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with custom details', () => {
		const details = { field: 'email', error: 'Custom error' };

		const exception = new GatewayTimeoutException('Custom error', details);

		expect(exception.statusCode).toBe(HTTP_STATUS.GATEWAY_TIMEOUT);
		expect(exception.message).toBe('Custom error');
		expect(exception.details).toEqual(details);
	});
});
