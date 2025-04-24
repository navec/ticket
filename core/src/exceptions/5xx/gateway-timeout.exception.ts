import { HTTP_STATUS } from '../../constants/http-status.constant';
import { HttpException } from '../http.exception';

export class GatewayTimeoutException<T = object> extends HttpException<T> {
	constructor(message = 'Gateway Timeout', details?: T) {
		super(HTTP_STATUS.GATEWAY_TIMEOUT, message, details);
	}
}
