import { HTTP_STATUS } from '@core/constants';
import { HttpException } from '@core/exceptions/http.exception';

export class NotFoundException<T = object> extends HttpException<T> {
	constructor(message = 'Not Found', details?: T) {
		super(HTTP_STATUS.NOT_FOUND, message, details);
	}
}
