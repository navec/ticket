import { HTTP_STATUS } from '@core/constants/http-status.constant';
import { HttpException } from '@core/exceptions';

export class ConflictException<T = object> extends HttpException<T> {
	constructor(message = 'Conflict', details?: T) {
		super(HTTP_STATUS.CONFLICT, message, details);
	}
}
