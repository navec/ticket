import { HTTP_STATUS } from '@core/constants';
import { HttpException } from '@core/exceptions/http.exception';

export class ForbiddenException<T = object> extends HttpException<T> {
	constructor(message = 'Forbidden', details?: T) {
		super(HTTP_STATUS.FORBIDDEN, message, details);
	}
}
