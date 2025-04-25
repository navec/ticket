import { HTTP_STATUS } from '@core/constants';
import { HttpException } from '@core/exceptions/http.exception';

export class UnprocessableEntityException<T = object> extends HttpException<T> {
	constructor(message = 'Unprocessable Entity', details?: T) {
		super(HTTP_STATUS.UNPROCESSABLE_ENTITY, message, details);
	}
}
