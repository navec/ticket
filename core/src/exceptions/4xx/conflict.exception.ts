import { HTTP_STATUS } from '@core/constants';
import { HttpException } from '@core/exceptions/http.exception';

export class ConflictException<T = object> extends HttpException<T> {
	constructor(message = 'Conflict', details?: T) {
		super(HTTP_STATUS.CONFLICT, message, details);
	}
}
