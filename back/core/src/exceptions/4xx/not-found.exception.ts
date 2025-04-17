import {HTTP_STATUS} from '../../constants/http-status.constant';
import {HttpException} from '../http.exception';

export class NotFoundException<T = {}> extends HttpException<T> {
  constructor(message = 'Not Found', details?: T) {
    super(HTTP_STATUS.NOT_FOUND, message, details);
  }
}
