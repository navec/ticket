import { HTTP_STATUS } from '@core/constants/http-status.constant';
import { HttpException } from '@core/exceptions';

export class InternalServerException<T = object> extends HttpException<T> {
	constructor(message = 'Internal Server Error', details?: T) {
		super(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, details);
	}
}
