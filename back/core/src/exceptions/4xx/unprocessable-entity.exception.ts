import {HTTP_STATUS} from '../../constants/http-status.constant';
import {HttpException} from '../http.exception';

export class UnprocessableEntityException<T = any> extends HttpException<T> {
  constructor(message = 'Unprocessable Entity', details?: T) {
    super(HTTP_STATUS.UNPROCESSABLE_ENTITY, message, details);
  }
}
