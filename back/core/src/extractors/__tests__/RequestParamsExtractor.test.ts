import { describe, it, expect, vi } from 'vitest';
import { RequestParamsExtractor } from '../RequestParamsExtractor';
import { Request, Response, ParamType } from 'core/src';
import * as Utils from 'core/src/decorators/utils';

vi.mock('core/src/decorators/utils', async () => {
	const actual = await vi.importActual('core/src/decorators/utils');
	return { ...actual, getMetadata: vi.fn() };
});

describe(RequestParamsExtractor.name, () => {
	const getMetadataSpy = vi.spyOn(Utils, 'getMetadata');
	const request = {
		body: Promise.resolve({ key1: 'value1', key2: 'value2' }),
		query: { queryKey: 'queryValue' },
		path: { pathKey: 'pathValue' },
		headers: { headerKey: 'headerValue' },
	} as unknown as Request;

	const response = {} as Response;

	const target = { someMethod: vi.fn() };
	const method = Object.keys(target).shift() || '';

	it('should extract body parameters correctly for body with key', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		getMetadataSpy.mockReturnValueOnce([{ index: 0, key: 'key1' }]);

		const result = await extractor.extract();

		expect(result).toEqual(['value1']);
	});

	it('should extract body parameters correctly', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		getMetadataSpy.mockReturnValueOnce([{ index: 0 }]);

		const result = await extractor.extract();

		expect(result).toEqual([{ key1: 'value1', key2: 'value2' }]);
	});

	it('should extract query parameters correctly for query with key', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		getMetadataSpy
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([{ index: 0, key: 'queryKey' }]);

		const result = await extractor.extract();

		expect(result).toEqual(['queryValue']);
	});

	it('should extract query parameters correctly', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		getMetadataSpy
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([{ index: 0 }]);

		const result = await extractor.extract();

		expect(result).toEqual([{ queryKey: 'queryValue' }]);
	});

	it('should extract path parameters correctly for path with key', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		getMetadataSpy
			.mockReturnValueOnce([])
			.mockReturnValueOnce([{ index: 0, key: 'pathKey' }]);

		const result = await extractor.extract();

		expect(result).toEqual(['pathValue']);
	});

	it('should extract path parameters correctly', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		getMetadataSpy.mockReturnValueOnce([]).mockReturnValueOnce([{ index: 0 }]);

		const result = await extractor.extract();

		expect(result).toEqual([{ pathKey: 'pathValue' }]);
	});

	it('should extract request object correctly', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		getMetadataSpy
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([{ index: 0 }]);

		const result = await extractor.extract();

		expect(result).toEqual([
			{
				body: { key1: 'value1', key2: 'value2' },
				headers: { headerKey: 'headerValue' },
				path: { pathKey: 'pathValue' },
				query: { queryKey: 'queryValue' },
			},
		]);
	});

	it('should extract response object correctly', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		getMetadataSpy
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([{ index: 0 }]);

		const result = await extractor.extract();

		expect(result).toEqual([{}]);
	});

	it('should extract response object correctly', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		extractor['metadataKeyByParamType'] = {
			...extractor['metadataKeyByParamType'],
			fake: 'unsupported_param_metadata',
		} as unknown as Record<ParamType, string>;

		getMetadataSpy
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([{ index: 0 }]);

		const extractCb = () => extractor.extract();

		await expect(extractCb).rejects.toThrow('Unsupported parameter type: fake');
	});
});
