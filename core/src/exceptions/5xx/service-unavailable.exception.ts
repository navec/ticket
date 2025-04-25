import { HTTP_STATUS } from '@core/constants/http-status.constant';
import { HttpException } from '@core/exceptions';

export class ServiceUnavailableException<T = object> extends HttpException<T> {
	constructor(message = 'Service Unavailable', details?: T) {
		super(HTTP_STATUS.SERVICE_UNAVAILABLE, message, details);
	}
}
