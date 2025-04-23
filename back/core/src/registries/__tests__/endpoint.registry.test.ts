import {describe, it, expect, afterEach} from 'vitest';
import {EndpointsRegistry} from '../endpoint.registry';

describe('EndpointsRegistry', () => {
  const target = {
    method: {bound: () => {}, name: 'testMethod'},
    controller: {testController: () => {}},
  };

  afterEach(() => {
    EndpointsRegistry['store'].clear();
    EndpointsRegistry['storeForVariblesPath'].clear();
  });

  describe('register', () => {
    it('should register a static path in the store', () => {
      EndpointsRegistry.register('/static/path', target);

      const result = EndpointsRegistry['store'].get('/static/path');

      expect(result).toEqual({...target, path: '/static/path'});
    });

    it('should register a variable path in the storeForVariblesPath', () => {
      const variablePathRegex = '/variable/([^/]+)/path';
      EndpointsRegistry.register('/variable/:id/path', target);

      const result =
        EndpointsRegistry['storeForVariblesPath'].get(variablePathRegex);

      expect(result).toEqual({...target, path: '/variable/:id/path'});
    });
  });

  describe('get', () => {
    const commonTarget = {
      method: {bound: () => {}, name: 'testMethod'},
      controller: {testController: () => {}},
    };

    it('should retrieve a static path from the store', () => {
      const path = '/static/path';
      const target = {...commonTarget, path};
      EndpointsRegistry['store'].set(path, target);

      const result = EndpointsRegistry.get(path);

      expect(result).toEqual(target);
    });

    it('should retrieve a variable path from the storeForVariblesPath', () => {
      const variablePathRegex = '/variable/([^/]+)/path';
      const target = {...commonTarget, path: '/variable/:id/path'};
      EndpointsRegistry['storeForVariblesPath'].set(variablePathRegex, target);

      const result = EndpointsRegistry.get('/variable/123/path');

      expect(result).toEqual(target);
    });

    it('should return null if no matching path is found', () => {
      const result = EndpointsRegistry.get('/nonexistent/path');
      expect(result).toBeNull();
    });
  });
});
