import {HTTP_STATUS} from '../../constants/http-status.constant';
import {HttpException} from '../http.exception';

export class UnauthorizedException<T = {}> extends HttpException<T> {
  constructor(message = 'Unauthorized', details?: T) {
    super(HTTP_STATUS.UNAUTHORIZED, message, details);
  }
}
