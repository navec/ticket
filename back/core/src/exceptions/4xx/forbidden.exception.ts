import {HTTP_STATUS} from '../../constants/http-status.constant';
import {HttpException} from '../http.exception';

export class ForbiddenException<T = any> extends HttpException<T> {
  constructor(message = 'Forbidden', details?: T) {
    super(HTTP_STATUS.FORBIDDEN, message, details);
  }
}
