import {describe, it, expect, vi} from 'vitest';
import {AppBuilder} from '../app.builder';
import {Constructor, ServerAdapter} from 'core/src';

vi.mock('core/src', async importOriginal => {
  const actual = await importOriginal<typeof import('core/src')>();
  return {
    ...actual,
    Scanner: class {
      scan = vi.fn();
    },
    Injector: class {
      inject = vi.fn();
    },
    RouterRegistry: class {
      register = vi.fn();
    },
  };
});

describe('AppBuilder', () => {
  it('should set the module correctly', () => {
    const appBuilder = new AppBuilder();
    const mockModule = {} as Constructor;

    appBuilder.setModule(mockModule);

    expect(appBuilder['app'].module).toBe(mockModule);
  });

  it('should set the server correctly', () => {
    const appBuilder = new AppBuilder();
    const mockServer = {} as ServerAdapter;

    appBuilder.setServer(mockServer);

    expect(appBuilder['app'].server).toBe(mockServer);
  });

  it('should throw an error if build is called without a server', () => {
    const appBuilder = new AppBuilder();
    const mockModule = {} as Constructor;

    appBuilder.setModule(mockModule);

    expect(() => appBuilder.build()).toThrowError(
      'TODO add functional message',
    );
  });

  it('should throw an error if build is called without a module', () => {
    const appBuilder = new AppBuilder();
    const mockServer = {} as ServerAdapter;

    appBuilder.setServer(mockServer);

    expect(() => appBuilder.build()).toThrowError(
      'TODO add functional message',
    );
  });

  it('should call scanner, injector, and routerRegistry methods during build', () => {
    const appBuilder = new AppBuilder();
    const mockModule = {} as Constructor;
    const mockServer = {} as ServerAdapter;

    const scannerSpy = vi.spyOn(appBuilder['scanner'], 'scan');
    const injectorSpy = vi.spyOn(appBuilder['injector'], 'inject');
    const routerRegistrySpy = vi.spyOn(
      appBuilder['routerRegistry'],
      'register',
    );

    appBuilder.setModule(mockModule);
    appBuilder.setServer(mockServer);

    const result = appBuilder.build();

    expect(scannerSpy).toHaveBeenCalledWith(mockModule);
    expect(injectorSpy).toHaveBeenCalledWith(mockModule);
    expect(routerRegistrySpy).toHaveBeenCalled();
    expect(result).toBe(mockServer);
  });
});
