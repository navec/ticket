import { UnprocessableEntityException } from '@core/exceptions';
import { HTTP_STATUS } from '@core/constants';

describe(UnprocessableEntityException.name, () => {
	it('should create an instance with default message and status code', () => {
		const exception = new UnprocessableEntityException();

		expect(exception.statusCode).toBe(HTTP_STATUS.UNPROCESSABLE_ENTITY);
		expect(exception.message).toBe('Unprocessable Entity');
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with a custom message', () => {
		const customMessage = 'Custom Unprocessable Entity Message';

		const exception = new UnprocessableEntityException(customMessage);

		expect(exception.statusCode).toBe(HTTP_STATUS.UNPROCESSABLE_ENTITY);
		expect(exception.message).toBe(customMessage);
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with custom details', () => {
		const details = { field: 'email', error: 'Custom error' };

		const exception = new UnprocessableEntityException('Custom error', details);

		expect(exception.statusCode).toBe(HTTP_STATUS.UNPROCESSABLE_ENTITY);
		expect(exception.message).toBe('Custom error');
		expect(exception.details).toEqual(details);
	});
});
