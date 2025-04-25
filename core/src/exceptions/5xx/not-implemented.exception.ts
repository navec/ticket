import { HTTP_STATUS } from '@core/constants/http-status.constant';
import { HttpException } from '@core/exceptions';

export class NotImplementedException<T = object> extends HttpException<T> {
	constructor(message = 'Not Implemented', details?: T) {
		super(HTTP_STATUS.NOT_IMPLEMENTED, message, details);
	}
}
