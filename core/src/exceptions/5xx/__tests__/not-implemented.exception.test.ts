import { NotImplementedException } from '@core/exceptions';
import { HTTP_STATUS } from '@core/constants';

describe(NotImplementedException.name, () => {
	it('should create an instance with default message and status code', () => {
		const exception = new NotImplementedException();

		expect(exception.statusCode).toBe(HTTP_STATUS.NOT_IMPLEMENTED);
		expect(exception.message).toBe('Not Implemented');
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with a custom message', () => {
		const customMessage = 'Custom Not Implemented Message';

		const exception = new NotImplementedException(customMessage);

		expect(exception.statusCode).toBe(HTTP_STATUS.NOT_IMPLEMENTED);
		expect(exception.message).toBe(customMessage);
		expect(exception.details).toBeUndefined();
	});

	it('should create an instance with custom details', () => {
		const details = { field: 'email', error: 'Custom error' };

		const exception = new NotImplementedException('Custom error', details);

		expect(exception.statusCode).toBe(HTTP_STATUS.NOT_IMPLEMENTED);
		expect(exception.message).toBe('Custom error');
		expect(exception.details).toEqual(details);
	});
});
