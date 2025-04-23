import {IncomingMessage} from 'node:http';
import {describe, expect, it, vi} from 'vitest';
import {HttpServerRequestAdapter} from '../request.adapter';
import {EndpointsRegistry, ScoreValue} from 'core/src/registries';

describe(HttpServerRequestAdapter.name, () => {
  const createMockRequest = (
    overrides: Partial<IncomingMessage> = {},
  ): IncomingMessage => {
    const defaultRequest: Partial<IncomingMessage> = {
      url: '/test?key=value',
      headers: {host: 'localhost', 'content-type': 'application/json'},
      on: vi.fn(),
    };
    return {...defaultRequest, ...overrides} as IncomingMessage;
  };

  describe('pathname', () => {
    it('should return the pathname of the request URL', () => {
      const request = createMockRequest({url: '/test/path'});
      const adapter = new HttpServerRequestAdapter(request);
      expect(adapter.pathname).toBe('/test/path');
    });
  });

  describe('body', () => {
    it('should parse and return the JSON body', async () => {
      const request = createMockRequest({
        on: vi.fn((event: 'data' | 'end', listener: Function) => {
          if (event === 'data') listener(Buffer.from('{"key":"value"}'));
          if (event === 'end') listener();
        }) as unknown as IncomingMessage['on'],
      });
      const adapter = new HttpServerRequestAdapter(request);

      const body = await adapter.body;
      expect(body).toEqual({key: 'value'});
    });

    it('should return an empty object for an empty JSON body', async () => {
      const request = createMockRequest({
        on: vi.fn((event: 'data' | 'end', listener: Function) => {
          if (event === 'data') listener(Buffer.from(''));
          if (event === 'end') listener();
        }) as unknown as IncomingMessage['on'],
      });
      const adapter = new HttpServerRequestAdapter(request);

      const body = await adapter.body;
      expect(body).toEqual({});
    });

    it('should throw BadRequestException for invalid JSON', async () => {
      const request = createMockRequest({
        url: undefined,
        on: vi.fn((event: 'data' | 'end', listener: Function) => {
          if (event === 'data') listener('invalid-json');
          if (event === 'end') listener();
        }) as unknown as IncomingMessage['on'],
      });
      const adapter = new HttpServerRequestAdapter(request);

      await expect(adapter.body).rejects.toThrowError('Invalid JSON body');
    });
  });

  describe('query', () => {
    it('should return the query parameters as an object', () => {
      const request = createMockRequest({url: '/test?key=value&foo=bar'});
      const adapter = new HttpServerRequestAdapter(request);
      expect(adapter.query).toEqual({key: 'value', foo: 'bar'});
    });

    it('should return an empty object if no query parameters are present', () => {
      const request = createMockRequest({url: '/test'});
      const adapter = new HttpServerRequestAdapter(request);
      expect(adapter.query).toEqual({});
    });
  });

  describe('path', () => {
    it('should return route variables if the endpoint is registered', () => {
      const request = createMockRequest({url: '/users/123'});
      vi.spyOn(EndpointsRegistry, 'get').mockReturnValueOnce({
        path: '/users/:id',
      } as ScoreValue);

      const adapter = new HttpServerRequestAdapter(request);
      expect(adapter.path).toEqual({id: '123'});
    });

    it('should return an empty object if the endpoint is not registered', () => {
      const request = createMockRequest({url: '/unknown'});
      vi.spyOn(EndpointsRegistry, 'get').mockReturnValueOnce(undefined);

      const adapter = new HttpServerRequestAdapter(request);
      expect(adapter.path).toEqual({});
    });
  });

  describe('cookies', () => {
    it('should throw an error as the method is not implemented', () => {
      const request = createMockRequest();
      const adapter = new HttpServerRequestAdapter(request);
      expect(() => adapter.cookies).toThrow('Method not implemented.');
    });
  });

  describe('raw', () => {
    it('should return the raw IncomingMessage', () => {
      const request = createMockRequest();
      const adapter = new HttpServerRequestAdapter(request);
      expect(adapter.raw).toBe(request);
    });
  });

  describe('headers', () => {
    it('should return the headers as a lowercase key-value object', () => {
      const request = createMockRequest({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
      });
      const adapter = new HttpServerRequestAdapter(request);
      expect(adapter.headers).toEqual({
        'content-type': 'application/json',
        authorization: 'Bearer token',
      });
    });

    it('should handle array headers correctly', () => {
      const request = createMockRequest({
        headers: {'set-cookie': ['cookie1=value1', 'cookie2=value2']},
      });
      const adapter = new HttpServerRequestAdapter(request);
      expect(adapter.headers['set-cookie']).toBe(
        'cookie1=value1, cookie2=value2',
      );
    });

    it('should return an empty string for undefined array headers', () => {
      const request = createMockRequest({
        headers: {'set-cookie': undefined},
      });
      const adapter = new HttpServerRequestAdapter(request);
      expect(adapter.headers['set-cookie']).toBe('');
    });
  });
});
