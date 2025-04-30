import { HTTP_STATUS } from '@core/constants';
import { HttpException } from '@core/exceptions/http.exception';

export class NotImplementedException<T = object> extends HttpException<T> {
	constructor(message = 'Not Implemented', details?: T) {
		super(HTTP_STATUS.NOT_IMPLEMENTED, message, details);
	}
}
