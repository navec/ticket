import { RouterRegistry } from '@core/routers';
import { Constructor } from '@core/types';
import { ControllersRegistry } from '@core/registries';
import { METHOD_METADATA, PATH_METADATA } from '@core/constants';

const mockGetMetadata = jest.fn();
jest.mock('@core/decorators', () => ({
	getMetadata: (...args: unknown[]) => mockGetMetadata(...args),
}));

const mockEndpointsRegistry = jest.fn();
jest.mock('@core/registries', () => ({
	...jest.requireActual('@core/registries'),
	EndpointsRegistry: {
		register: (...args: unknown[]) => mockEndpointsRegistry(...args),
	},
}));

describe('RouterRegistry', () => {
	const [methodOne, methodTwo] = [jest.fn(), jest.fn()];
	const Controller: Constructor = Object.create({
		prototype: { methodOne, methodTwo },
	});
	const instance = Object.create({ methodOne, methodTwo });

	afterEach(() => {
		mockEndpointsRegistry.mockClear();
	});

	it('should not call getMetadata when no controllers are registered', () => {
		const routerRegistry = new RouterRegistry();
		routerRegistry.register();

		expect(mockGetMetadata).not.toHaveBeenCalled();
	});

	it('should register endpoints for valid controllers', () => {
		ControllersRegistry.register(Controller, instance);

		mockGetMetadata.mockImplementation((key, target) => {
			if (key === PATH_METADATA) {
				if (target === Controller) return 'base';
				if (target === instance.methodOne) return '/method-one';
				if (target === instance.methodTwo) return '/method-two';
			}
			if (key === METHOD_METADATA) {
				if (target === instance.methodOne) return 'GET';
				if (target === instance.methodTwo) return 'POST';
			}
			return undefined;
		});

		const routerRegistry = new RouterRegistry();
		routerRegistry.register();

		expect(mockGetMetadata).toHaveBeenCalledWith(PATH_METADATA, Controller);
		expect(mockGetMetadata).toHaveBeenCalledWith(
			PATH_METADATA,
			instance.methodOne
		);
		expect(mockGetMetadata).toHaveBeenCalledWith(
			PATH_METADATA,
			instance.methodTwo
		);
		expect(mockGetMetadata).toHaveBeenCalledWith(
			METHOD_METADATA,
			instance.methodOne
		);
		expect(mockGetMetadata).toHaveBeenCalledWith(
			METHOD_METADATA,
			instance.methodTwo
		);

		expect(mockEndpointsRegistry).toHaveBeenCalledTimes(2);
		expect(mockEndpointsRegistry).toHaveBeenNthCalledWith(
			1,
			'/base/method-one',
			{
				controller: instance,
				method: { bound: expect.any(Function), name: 'methodOne' },
			}
		);
		expect(mockEndpointsRegistry).toHaveBeenNthCalledWith(
			2,
			'/base/method-two',
			{
				controller: instance,
				method: { bound: expect.any(Function), name: 'methodTwo' },
			}
		);
	});

	it('should skip controllers without an instance', () => {
		ControllersRegistry.register(Controller, null);

		const routerRegistry = new RouterRegistry();
		routerRegistry.register();

		expect(mockEndpointsRegistry).not.toHaveBeenCalled();
	});

	it('should skip methods without a path metadata', () => {
		ControllersRegistry.register(Controller, instance);
		mockGetMetadata.mockImplementation((key, target) => {
			if (key === PATH_METADATA && target === Controller) return 'base';
			if (key === PATH_METADATA && target === instance.methodOne)
				return '/method-one';
			if (key === METHOD_METADATA && target === instance.methodOne)
				return 'GET';
			return undefined;
		});

		const routerRegistry = new RouterRegistry();
		routerRegistry.register();

		expect(mockEndpointsRegistry).toHaveBeenCalledTimes(1);
		expect(mockEndpointsRegistry).toHaveBeenCalledWith('/base/method-one', {
			controller: instance,
			method: { bound: expect.any(Function), name: 'methodOne' },
		});
		expect(mockEndpointsRegistry).not.toHaveBeenCalledWith(
			'/base/method-two',
			expect.anything()
		);
	});
});
