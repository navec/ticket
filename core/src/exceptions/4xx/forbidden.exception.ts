import { HTTP_STATUS } from '@core/constants/http-status.constant';
import { HttpException } from '@core/exceptions';

export class ForbiddenException<T = object> extends HttpException<T> {
	constructor(message = 'Forbidden', details?: T) {
		super(HTTP_STATUS.FORBIDDEN, message, details);
	}
}
