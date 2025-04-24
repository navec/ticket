import { describe, it, expect, vi, afterEach, Mock } from 'vitest';
import { RouterRegistry } from '../router-registry';
import {
	ControllersRegistry,
	EndpointsRegistry,
	getMetadata,
	PATH_METADATA,
	METHOD_METADATA,
	Constructor,
} from 'core/src';

vi.mock('core/src', async (importOriginal) => {
	const actual = await importOriginal<typeof import('core/src')>();
	return { ...actual, getMetadata: vi.fn() };
});

describe('RouterRegistry', () => {
	const getMetadataSpy = vi.mocked(getMetadata) as Mock;
	const endpointsRegistrySpy = vi.spyOn(EndpointsRegistry, 'register');

	const [methodOne, methodTwo] = [vi.fn(), vi.fn()];
	const Controller: Constructor = Object.create({
		prototype: { methodOne, methodTwo },
	});
	const instance = Object.create({ methodOne, methodTwo });

	afterEach(() => {
		endpointsRegistrySpy.mockClear();
	});

	it('should not call getMetadata when no controllers are registered', () => {
		const routerRegistry = new RouterRegistry();
		routerRegistry.register();

		expect(getMetadataSpy).not.toHaveBeenCalled();
	});

	it('should register endpoints for valid controllers', () => {
		ControllersRegistry.register(Controller, instance);

		getMetadataSpy.mockImplementation((key, target) => {
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

		expect(getMetadata).toHaveBeenCalledWith(PATH_METADATA, Controller);
		expect(getMetadata).toHaveBeenCalledWith(PATH_METADATA, instance.methodOne);
		expect(getMetadata).toHaveBeenCalledWith(PATH_METADATA, instance.methodTwo);
		expect(getMetadata).toHaveBeenCalledWith(
			METHOD_METADATA,
			instance.methodOne
		);
		expect(getMetadata).toHaveBeenCalledWith(
			METHOD_METADATA,
			instance.methodTwo
		);

		expect(endpointsRegistrySpy).toHaveBeenCalledTimes(2);
		expect(endpointsRegistrySpy).toHaveBeenNthCalledWith(
			1,
			'/base/method-one',
			{
				controller: instance,
				method: { bound: expect.any(Function), name: 'methodOne' },
			}
		);
		expect(endpointsRegistrySpy).toHaveBeenNthCalledWith(
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

		expect(endpointsRegistrySpy).not.toHaveBeenCalled();
	});

	it('should skip methods without a path metadata', () => {
		ControllersRegistry.register(Controller, instance);
		vi.mocked(getMetadata).mockImplementation((key, target) => {
			if (key === PATH_METADATA && target === Controller) return 'base';
			if (key === PATH_METADATA && target === instance.methodOne)
				return '/method-one';
			if (key === METHOD_METADATA && target === instance.methodOne)
				return 'GET';
			return undefined;
		});

		const routerRegistry = new RouterRegistry();
		routerRegistry.register();

		expect(endpointsRegistrySpy).toHaveBeenCalledTimes(1);
		expect(endpointsRegistrySpy).toHaveBeenCalledWith('/base/method-one', {
			controller: instance,
			method: { bound: expect.any(Function), name: 'methodOne' },
		});
		expect(endpointsRegistrySpy).not.toHaveBeenCalledWith(
			'/base/method-two',
			expect.anything()
		);
	});
});
