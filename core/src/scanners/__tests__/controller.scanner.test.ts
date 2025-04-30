import { ControllerScanner } from '@core/scanners';
import { PROVIDER_SCOPE_METADATA } from '@core/constants';

const mockGetMetadata = jest.fn();
jest.mock('@core/decorators', () => ({
	getMetadata: (...args: unknown[]) => mockGetMetadata(...args),
}));

const mockControllersRegistry = jest.fn();
jest.mock('@core/registries', () => ({
	ControllersRegistry: {
		register: (...args: unknown[]) => mockControllersRegistry(...args),
	},
}));

describe('ControllerScanner', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should register controllers with valid metadata', () => {
		const Controller = class {};
		mockGetMetadata.mockReturnValue({ type: 'controller' });

		ControllerScanner.scan([Controller]);

		expect(mockGetMetadata).toHaveBeenCalledWith(
			PROVIDER_SCOPE_METADATA,
			Controller
		);
		expect(mockControllersRegistry).toHaveBeenCalledWith(Controller);
	});

	it('should throw an error if metadata type is not "controller"', () => {
		const Controller = class {};
		mockGetMetadata.mockReturnValue({ type: 'service' });
		const expectedMessage =
			'controller type is required, currently we have service type';

		const callback = () => ControllerScanner.scan([Controller]);

		expect(callback).toThrowError(expectedMessage);

		expect(mockGetMetadata).toHaveBeenCalledWith(
			PROVIDER_SCOPE_METADATA,
			Controller
		);
		expect(mockControllersRegistry).not.toHaveBeenCalled();
	});
});
