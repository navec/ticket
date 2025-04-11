export class HttpException<T = any> extends Error {
  public readonly statusCode: number;
  public readonly details?: T;

  constructor(statusCode: number, message: string, details?: T) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    }
  }

  toJSON() {
    return {
      name: this.name,
      statusCode: this.statusCode,
      message: this.message,
      details: this.details,
      stack: this.stack,
    };
  }

  toJSONString() {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}
