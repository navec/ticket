import { describe, it, expect, vi } from 'vitest';
import { getMetadata } from '@core/decorators';
import { SCHEMA_PARAM_METADATA } from '@core/constants';
import { DtoExtractor } from '@core/extractors';

vi.mock('..', () => ({ getMetadata: vi.fn() }));

describe('DtoExtractor', () => {
	const target = Object.create({});
	const method = 'testMethod';

	it('should return an empty array if no metadata is found', () => {
		const extractor = new DtoExtractor({ target, method });
		vi.mocked(getMetadata).mockReturnValueOnce(undefined);

		const result = extractor.extract();

		expect(result).toEqual([]);
		expect(getMetadata).toHaveBeenCalledWith(SCHEMA_PARAM_METADATA, {}, method);
	});

	it('should extract schemas from metadata', () => {
		const extractor = new DtoExtractor({ target, method });
		vi.mocked(getMetadata).mockReturnValueOnce([
			{ index: 0, dtodWithSchema: { schema: { field1: 'value1' } } },
			{ index: 2, dtodWithSchema: { schema: { field2: 'value2' } } },
		]);

		const result = extractor.extract();

		expect(result).toEqual([
			{ field1: 'value1' },
			undefined,
			{ field2: 'value2' },
		]);
		expect(getMetadata).toHaveBeenCalledWith(SCHEMA_PARAM_METADATA, {}, method);
	});

	it('should handle an empty metadata array', () => {
		const extractor = new DtoExtractor({ target, method });
		vi.mocked(getMetadata).mockReturnValueOnce([]);

		const result = extractor.extract();

		expect(result).toEqual([]);
		expect(getMetadata).toHaveBeenCalledWith(SCHEMA_PARAM_METADATA, {}, method);
	});
});
