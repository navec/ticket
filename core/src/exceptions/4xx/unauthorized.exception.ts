import { HTTP_STATUS } from '@core/constants/http-status.constant';
import { HttpException } from '@core/exceptions';

export class UnauthorizedException<T = object> extends HttpException<T> {
	constructor(message = 'Unauthorized', details?: T) {
		super(HTTP_STATUS.UNAUTHORIZED, message, details);
	}
}
