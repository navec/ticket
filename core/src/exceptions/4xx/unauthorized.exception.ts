import { HTTP_STATUS } from '@core/constants';
import { HttpException } from '@core/exceptions/http.exception';

export class UnauthorizedException<T = object> extends HttpException<T> {
	constructor(message = 'Unauthorized', details?: T) {
		super(HTTP_STATUS.UNAUTHORIZED, message, details);
	}
}
