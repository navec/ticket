import {HTTP_STATUS} from '../../constants/http-status.constant';
import {HttpException} from '../http.exception';

export class InternalServerException<T = any> extends HttpException<T> {
  constructor(message = 'Internal Server Error', details?: T) {
    super(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, details);
  }
}
