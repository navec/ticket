import {describe, it, expect, vi, afterEach, Mock} from 'vitest';
import {ControllerScanner} from '../controller.scanner';
import {
  ControllersRegistry,
  getMetadata,
  PROVIDER_SCOPE_METADATA,
} from 'core/src';

vi.mock('core/src', async importOriginal => {
  const actual = await importOriginal<typeof import('core/src')>();
  return {
    ...actual,
    ControllersRegistry: {register: vi.fn()},
    getMetadata: vi.fn(),
  };
});

describe('ControllerScanner', () => {
  const getMetadataSpy = getMetadata as Mock;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register controllers with valid metadata', () => {
    const Controller = class {};
    getMetadataSpy.mockReturnValue({type: 'controller'});

    ControllerScanner.scan([Controller]);

    expect(getMetadata).toHaveBeenCalledWith(
      PROVIDER_SCOPE_METADATA,
      Controller,
    );
    expect(ControllersRegistry.register).toHaveBeenCalledWith(Controller);
  });

  it('should throw an error if metadata type is not "controller"', () => {
    const Controller = class {};
    getMetadataSpy.mockReturnValue({type: 'service'});
    const expectedMessage =
      'controller type is required, currently we have service type';

    const callback = () => ControllerScanner.scan([Controller]);

    expect(callback).toThrowError(expectedMessage);

    expect(getMetadata).toHaveBeenCalledWith(
      PROVIDER_SCOPE_METADATA,
      Controller,
    );
    expect(ControllersRegistry.register).not.toHaveBeenCalled();
  });
});
