import { RequestParamsExtractor } from '@core/extractors';
import { Request, Response } from '@core/adapters';
import { ParamType } from '@core/enums';

const mockGetMetadata = jest.fn();
jest.mock('@core/decorators', () => ({
	...jest.requireActual('@core/decorators'),
	getMetadata: (...args: unknown[]) => mockGetMetadata(...args),
}));

describe(RequestParamsExtractor.name, () => {
	const request = {
		body: Promise.resolve({ key1: 'value1', key2: 'value2' }),
		query: { queryKey: 'queryValue' },
		path: { pathKey: 'pathValue' },
		headers: { headerKey: 'headerValue' },
	} as unknown as Request;

	const response = {} as Response;

	const target = { someMethod: jest.fn() };
	const method = Object.keys(target).shift() || '';

	it('should extract body parameters correctly for body with key', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		mockGetMetadata.mockReturnValueOnce([{ index: 0, key: 'key1' }]);

		const result = await extractor.extract();

		expect(result).toEqual(['value1']);
	});

	it('should extract body parameters correctly', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		mockGetMetadata.mockReturnValueOnce([{ index: 0 }]);

		const result = await extractor.extract();

		expect(result).toEqual([{ key1: 'value1', key2: 'value2' }]);
	});

	it('should extract query parameters correctly for query with key', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		mockGetMetadata
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([{ index: 0, key: 'queryKey' }]);

		const result = await extractor.extract();

		expect(result).toEqual(['queryValue']);
	});

	it('should extract query parameters correctly', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		mockGetMetadata
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([{ index: 0 }]);

		const result = await extractor.extract();

		expect(result).toEqual([{ queryKey: 'queryValue' }]);
	});

	it('should extract path parameters correctly for path with key', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		mockGetMetadata
			.mockReturnValueOnce([])
			.mockReturnValueOnce([{ index: 0, key: 'pathKey' }]);

		const result = await extractor.extract();

		expect(result).toEqual(['pathValue']);
	});

	it('should extract path parameters correctly', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		mockGetMetadata.mockReturnValueOnce([]).mockReturnValueOnce([{ index: 0 }]);

		const result = await extractor.extract();

		expect(result).toEqual([{ pathKey: 'pathValue' }]);
	});

	it('should extract request object correctly', async () => {
		const params = { request, response, target, method };
		const extractor = new RequestParamsExtractor(params);
		mockGetMetadata
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
		mockGetMetadata
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

		mockGetMetadata
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
