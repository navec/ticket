import { SCHEMA_PARAM_METADATA } from '@core/constants';
import { DtoExtractor } from '@core/extractors';

const mockGetMetadata = jest.fn();
jest.mock('@core/decorators', () => ({
	...jest.requireActual('@core/decorators'),
	getMetadata: (...args: unknown[]) => mockGetMetadata(...args),
}));

describe(DtoExtractor.name, () => {
	const target = Object.create({});
	const method = 'testMethod';

	it('should return an empty array if no metadata is found', () => {
		const extractor = new DtoExtractor({ target, method });
		mockGetMetadata.mockReturnValueOnce(undefined);

		const result = extractor.extract();

		expect(result).toEqual([]);
		expect(mockGetMetadata).toHaveBeenCalledWith(
			SCHEMA_PARAM_METADATA,
			{},
			method
		);
	});

	it('should extract schemas from metadata', () => {
		const extractor = new DtoExtractor({ target, method });
		mockGetMetadata.mockReturnValueOnce([
			{ index: 0, dtodWithSchema: { schema: { field1: 'value1' } } },
			{ index: 2, dtodWithSchema: { schema: { field2: 'value2' } } },
		]);

		const result = extractor.extract();

		expect(result).toEqual([
			{ field1: 'value1' },
			undefined,
			{ field2: 'value2' },
		]);
		expect(mockGetMetadata).toHaveBeenCalledWith(
			SCHEMA_PARAM_METADATA,
			{},
			method
		);
	});

	it('should handle an empty metadata array', () => {
		const extractor = new DtoExtractor({ target, method });
		mockGetMetadata.mockReturnValueOnce([]);

		const result = extractor.extract();

		expect(result).toEqual([]);
		expect(mockGetMetadata).toHaveBeenCalledWith(
			SCHEMA_PARAM_METADATA,
			{},
			method
		);
	});
});
