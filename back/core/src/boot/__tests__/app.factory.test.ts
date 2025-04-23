import {describe, it, expect, vi} from 'vitest';
import {AppBootFactory} from '../app.factory';
import {SERVER_TYPE_ADAPTER_REGISTRY} from '../app.constants';
import {AppBuilder} from '../app.builder';
import {ServerAdapter, ServerType} from 'core/src';

describe('AppFactory', () => {
  describe('getServer', () => {
    it('should return the correct ServerAdapter for a valid server type', () => {
      const mockAdapter = vi.fn();
      SERVER_TYPE_ADAPTER_REGISTRY[ServerType.HTTP_SERVER] = mockAdapter;

      const server = AppBootFactory.getServer(ServerType.HTTP_SERVER);

      expect(server).toBeInstanceOf(mockAdapter);
    });

    it('should throw an error for an unsupported server type', () => {
      expect(() =>
        AppBootFactory.getServer('INVALID_TYPE' as ServerType),
      ).toThrow('Unsupported or unimplemented server type: INVALID_TYPE');
    });
  });

  describe('create', () => {
    it('should create an AppBuilder instance with the correct module and server', async () => {
      const mockModule = class {};
      const mockServer = vi.fn();
      SERVER_TYPE_ADAPTER_REGISTRY[ServerType.HTTP_SERVER] = mockServer;

      const appBuilderSpy = vi
        .spyOn(AppBuilder.prototype, 'build')
        .mockResolvedValue('mockApp' as unknown as ServerAdapter);

      const app = await AppBootFactory.create(mockModule, {
        type: ServerType.HTTP_SERVER,
      });

      expect(appBuilderSpy).toHaveBeenCalled();
      expect(app).toBe('mockApp');
      appBuilderSpy.mockRestore();
    });

    it('should use the default server type if none is provided', async () => {
      const mockModule = class {};
      const mockServer = vi.fn();
      SERVER_TYPE_ADAPTER_REGISTRY[ServerType.HTTP_SERVER] = mockServer;

      const appBuilderSpy = vi
        .spyOn(AppBuilder.prototype, 'build')
        .mockResolvedValue('mockApp' as unknown as ServerAdapter);

      const app = await AppBootFactory.create(mockModule);

      expect(appBuilderSpy).toHaveBeenCalled();
      expect(app).toBe('mockApp');
      appBuilderSpy.mockRestore();
    });
  });
});
