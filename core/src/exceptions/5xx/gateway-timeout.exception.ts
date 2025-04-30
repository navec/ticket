import { HTTP_STATUS } from '@core/constants';
import { HttpException } from '@core/exceptions/http.exception';

export class GatewayTimeoutException<T = object> extends HttpException<T> {
	constructor(message = 'Gateway Timeout', details?: T) {
		super(HTTP_STATUS.GATEWAY_TIMEOUT, message, details);
	}
}
