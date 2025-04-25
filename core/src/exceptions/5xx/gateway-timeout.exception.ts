import { HTTP_STATUS } from '@core/constants/http-status.constant';
import { HttpException } from '@core/exceptions';

export class GatewayTimeoutException<T = object> extends HttpException<T> {
	constructor(message = 'Gateway Timeout', details?: T) {
		super(HTTP_STATUS.GATEWAY_TIMEOUT, message, details);
	}
}
