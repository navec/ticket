import { DtoSchema } from '@core/decorators';
import { describe, it, expect } from 'vitest';

describe('DtoSchema Decorator', () => {
	it('should add __isDTO property to the target prototype', () => {
		const schema = { type: 'object', properties: { name: { type: 'string' } } };
		const testClass = Object.create({ prototype: {} });

		DtoSchema(schema)(testClass);

		expect(testClass.prototype.__isDTO).toBe(true);
	});

	it('should add schema to the target', () => {
		const schema = { type: 'object', properties: { age: { type: 'number' } } };
		const testClass = Object.create({ prototype: {} });

		DtoSchema(schema)(testClass);

		expect(testClass.schema).toEqual(schema);
	});
});
