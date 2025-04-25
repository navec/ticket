import { HTTP_STATUS } from '@core/constants';
import { HttpException } from '@core/exceptions/http.exception';

export class InternalServerException<T = object> extends HttpException<T> {
	constructor(message = 'Internal Server Error', details?: T) {
		super(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, details);
	}
}
