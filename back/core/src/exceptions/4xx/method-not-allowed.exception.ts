import {HTTP_STATUS} from '../../constants/http-status.constant';
import {HttpException} from '../http.exception';

export class MethodNotAllowedException<T = any> extends HttpException<T> {
  constructor(message = 'Method Not Allowed', details?: T) {
    super(HTTP_STATUS.METHOD_NOT_ALLOWED, message, details);
  }
}
