import { HTTP_STATUS } from '../../constants/http-status.constant';
import { HttpException } from '../http.exception';

export class ConflictException<T = object> extends HttpException<T> {
	constructor(message = 'Conflict', details?: T) {
		super(HTTP_STATUS.CONFLICT, message, details);
	}
}
