import {HTTP_STATUS} from '../../constants/http-status.constant';
import {HttpException} from '../http.exception';

export class NotImplementedException<T = {}> extends HttpException<T> {
  constructor(message = 'Not Implemented', details?: T) {
    super(HTTP_STATUS.NOT_IMPLEMENTED, message, details);
  }
}
