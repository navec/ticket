import {describe, it, expect, vi, beforeEach} from 'vitest';
import http from 'node:http';
import {HttpServerAdapter} from '../server.adapter';
import {EndpointsRegistry, ValidatorType, ZodAdapter} from '../../../..';

vi.spyOn(http, 'createServer');
vi.mock('node:http', async importOriginal => {
  const actual = await importOriginal<typeof import('node:http')>();
  return {...actual, createServer: vi.fn()};
});

describe('HttpServerAdapter', () => {
  let serverAdapter: HttpServerAdapter;

  beforeEach(() => {
    serverAdapter = new HttpServerAdapter();
  });

  it('should initialize the server', () => {
    expect(http.createServer).toHaveBeenCalled();
  });

  it('should register a default middleware', () => {
    const middleware = vi.fn();
    serverAdapter.use(middleware);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Accessing private property for testing
    expect(serverAdapter.middlewares).toContainEqual({
      type: 'default',
      handler: middleware,
    });
  });

  it('should register a Zod validator middleware', () => {
    serverAdapter.useValidator(ValidatorType.ZOD);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Accessing private property for testing
    expect(serverAdapter.middlewares).toContainEqual({
      type: 'validator',
      handler: new ZodAdapter().validate,
    });
  });

  it('should throw an error for unsupported validator types', () => {
    expect(() =>
      serverAdapter.useValidator('INVALID' as ValidatorType),
    ).toThrow(
      'Validator type INVALID is not supported. Supported types are: ZOD',
    );
  });

  it('should start the server on the specified port', async () => {
    const listenMock = vi.fn((port, callback) => callback && callback());
    serverAdapter.serverInstance.listen = listenMock;

    await serverAdapter.listen(3000);

    expect(listenMock).toHaveBeenCalledWith(3000, undefined);
  });

  it('should handle unexpected errors during server startup', async () => {
    serverAdapter.serverInstance.listen = vi.fn(() => {
      throw new Error('Startup error');
    });

    await expect(serverAdapter.listen(3000)).rejects.toThrow(
      `[HttpServerAdapter.listen] ::  Unexpected error during server startup -> ${new Error('Startup error')}`,
    );
  });

  it('should return a 404 response for unknown routes', async () => {
    const request = {url: '/test', headers: {}} as http.IncomingMessage;
    const response = {setHeader: vi.fn(), finished: false, end: vi.fn()};

    serverAdapter.serverInstance.emit('request', request, response);

    expect(response.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/json',
    );

    const parsedResponse = JSON.parse(response.end.mock.calls[0][0]);
    expect(parsedResponse).toMatchObject({
      name: 'NotFoundException',
      statusCode: 404,
      message: '/test not found',
    });
  });

  it('should return success body response', async () => {
    const endpoint = {
      method: {bound: vi.fn(), name: 'test'},
      controller: {test: vi.fn()},
      path: '/test',
    };

    vi.mock('../../../..', async importOriginal => {
      const actual = await importOriginal<typeof import('../../../..')>();
      return {
        ...actual,
        EndpointsRegistry: {get: vi.fn()},
        RequestParamsExtractor: class {
          extract() {
            return Promise.resolve([]);
          }
        },
      };
    });

    vi.spyOn(EndpointsRegistry, 'get').mockReturnValueOnce(endpoint);
    endpoint.method.bound.mockImplementationOnce(() => ({name: 'test'}));

    const request = {url: '/test', headers: {}, method: 'POST'};
    const response = {setHeader: vi.fn(), finished: false, end: vi.fn()};
    vi.spyOn(response, 'end').mockImplementation(data => data);

    await new Promise<void>(resolve => {
      response.end = vi.fn(() => {
        resolve();
        return response;
      });
      serverAdapter.serverInstance.emit('request', request, response);
    });

    expect(response.end).toHaveBeenCalledWith(JSON.stringify({name: 'test'}));
    expect(response.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/json',
    );
  });
});
