import { HTTP_STATUS } from '@core/constants';
import { HttpException } from '@core/exceptions/http.exception';

export class MethodNotAllowedException<T = object> extends HttpException<T> {
	constructor(message = 'Method Not Allowed', details?: T) {
		super(HTTP_STATUS.METHOD_NOT_ALLOWED, message, details);
	}
}
