import { HttpMethod } from '@core/enums';
import { EndpointsRegistry } from '@core/registries';

describe(EndpointsRegistry.name, () => {
	const target = {
		method: { bound: jest.fn(), name: 'testMethod' },
		controller: { testController: jest.fn() },
		type: HttpMethod.GET,
	};

	afterEach(() => {
		EndpointsRegistry['store'].clear();
		EndpointsRegistry['storeForVariblesPath'].clear();
	});

	describe('register', () => {
		it('should register a static path in the store', () => {
			EndpointsRegistry.register('/static/path', target);

			const result = EndpointsRegistry['store'].get('get/static/path');

			expect(result).toEqual({ ...target, path: '/static/path' });
		});

		it('should register a variable path in the storeForVariblesPath', () => {
			const variablePathRegex = '/variable/([^/]+)/path';
			EndpointsRegistry.register('/variable/:id/path', target);

			const result = EndpointsRegistry['storeForVariblesPath'].get(
				`get${variablePathRegex}`
			);

			expect(result).toEqual({ ...target, path: '/variable/:id/path' });
		});
	});

	describe('get', () => {
		const commonTarget = {
			method: { bound: jest.fn(), name: 'testMethod' },
			controller: { testController: jest.fn() },
		};

		it('should retrieve a static path from the store', () => {
			const path = '/static/path';
			const target = { ...commonTarget, path, type: HttpMethod.GET };
			EndpointsRegistry['store'].set(`get${path}`, target);

			const result = EndpointsRegistry.get(path, HttpMethod.GET);

			expect(result).toEqual(target);
		});

		it('should retrieve a variable path from the storeForVariblesPath', () => {
			const variablePathRegex = '/variable/([^/]+)/path';
			const target = {
				...commonTarget,
				path: '/variable/:id/path',
				type: HttpMethod.POST,
			};
			EndpointsRegistry['storeForVariblesPath'].set(variablePathRegex, target);

			const result = EndpointsRegistry.get(
				'/variable/123/path',
				HttpMethod.POST
			);

			expect(result).toEqual(target);
		});

		it('should return null if no matching path is found', () => {
			const result = EndpointsRegistry.get(
				'/nonexistent/path',
				HttpMethod.PATCH
			);
			expect(result).toBeNull();
		});
	});
});
