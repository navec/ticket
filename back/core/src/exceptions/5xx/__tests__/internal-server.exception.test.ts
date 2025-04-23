import {describe, it, expect} from 'vitest';
import {InternalServerException} from '..';
import {HTTP_STATUS} from '../../../constants';

describe(InternalServerException.name, () => {
  it('should create an instance with default message and status code', () => {
    const exception = new InternalServerException();

    expect(exception.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(exception.message).toBe('Internal Server Error');
    expect(exception.details).toBeUndefined();
  });

  it('should create an instance with a custom message', () => {
    const customMessage = 'Custom Internal Server Error Message';

    const exception = new InternalServerException(customMessage);

    expect(exception.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(exception.message).toBe(customMessage);
    expect(exception.details).toBeUndefined();
  });

  it('should create an instance with custom details', () => {
    const details = {field: 'email', error: 'Custom error'};

    const exception = new InternalServerException('Custom error', details);

    expect(exception.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(exception.message).toBe('Custom error');
    expect(exception.details).toEqual(details);
  });
});
