import { BadGatewayException } from '@core/exceptions';
import { HTTP_STATUS } from '@core/constants';

describe(BadGatewayException.name, () => {
	it('should create an instance with default message and status code', () => {
		const exception = new BadGatewayException();

		expect(exception.statusCode).toBe(HTTP_STATUS.BAD_GATEWAY);
		expect(exception.message).toBe('Bad Gateway');
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with a custom message', () => {
		const customMessage = 'Custom Bad Gateway Message';

		const exception = new BadGatewayException(customMessage);

		expect(exception.statusCode).toBe(HTTP_STATUS.BAD_GATEWAY);
		expect(exception.message).toBe(customMessage);
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with custom details', () => {
		const details = { field: 'email', error: 'Custom error' };

		const exception = new BadGatewayException('Custom error', details);

		expect(exception.statusCode).toBe(HTTP_STATUS.BAD_GATEWAY);
		expect(exception.message).toBe('Custom error');
		expect(exception.details).toEqual(details);
	});
});
