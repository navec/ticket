import { HTTP_STATUS } from '@core/constants/http-status.constant';
import { HttpException } from '@core/exceptions';

export class UnprocessableEntityException<T = object> extends HttpException<T> {
	constructor(message = 'Unprocessable Entity', details?: T) {
		super(HTTP_STATUS.UNPROCESSABLE_ENTITY, message, details);
	}
}
