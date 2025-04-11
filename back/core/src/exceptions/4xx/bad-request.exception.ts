import { HTTP_STATUS } from "../../constants/http-status.constant";
import { HttpException } from "../http.exception";

export class BadRequestException<T = any> extends HttpException<T> {
  constructor(message = "Bad Request", details?: T) {
    super(HTTP_STATUS.BAD_REQUEST, message, details);
  }
}
