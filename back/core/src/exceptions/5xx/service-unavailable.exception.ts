import {HTTP_STATUS} from '../../constants/http-status.constant';
import {HttpException} from '../http.exception';

export class ServiceUnavailableException<T = any> extends HttpException<T> {
  constructor(message = 'Service Unavailable', details?: T) {
    super(HTTP_STATUS.SERVICE_UNAVAILABLE, message, details);
  }
}
