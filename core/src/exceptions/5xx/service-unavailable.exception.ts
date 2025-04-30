import { HTTP_STATUS } from '@core/constants';
import { HttpException } from '@core/exceptions/http.exception';

export class ServiceUnavailableException<T = object> extends HttpException<T> {
	constructor(message = 'Service Unavailable', details?: T) {
		super(HTTP_STATUS.SERVICE_UNAVAILABLE, message, details);
	}
}
