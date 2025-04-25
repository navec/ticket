import { HTTP_STATUS } from '@core/constants/http-status.constant';
import { HttpException } from '@core/exceptions';

export class BadGatewayException<T = object> extends HttpException<T> {
	constructor(message = 'Bad Gateway', details?: T) {
		super(HTTP_STATUS.BAD_GATEWAY, message, details);
	}
}
