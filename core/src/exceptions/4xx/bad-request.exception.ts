import { HTTP_STATUS } from '@core/constants/http-status.constant';
import { HttpException } from '@core/exceptions';

export class BadRequestException<T = object> extends HttpException<T> {
	constructor(message = 'Bad Request', details?: T) {
		super(HTTP_STATUS.BAD_REQUEST, message, details);
	}
}
