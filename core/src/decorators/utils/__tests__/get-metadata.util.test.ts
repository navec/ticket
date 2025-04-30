import 'reflect-metadata';
import { getMetadata } from '../get-metadata.util';

describe(getMetadata.name, () => {
	const getMetadataSpy = jest.spyOn(Reflect, 'getMetadata');

	afterEach(getMetadataSpy.mockClear);

	it('should return metadata for a class', () => {
		const metadataKey = 'testKey';
		const metadataValue = 'testValue';
		const target = class {};

		Reflect.defineMetadata(metadataKey, metadataValue, target);

		const result = getMetadata(metadataKey, target);
		expect(result).toBe(metadataValue);
	});

	it('should return metadata for a class property', () => {
		const metadataKey = 'testKey';
		const metadataValue = 'testValue';
		const target = {};
		const propertyKey = 'testProperty';

		Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);

		const result = getMetadata(metadataKey, target, propertyKey);
		expect(result).toBe(metadataValue);
	});

	it('should return undefined if metadata does not exist for a class', () => {
		const metadataKey = 'nonExistentKey';
		const target = class {};

		const result = getMetadata(metadataKey, target);
		expect(result).toBeUndefined();
	});

	it('should return undefined if metadata does not exist for a class property', () => {
		const metadataKey = 'nonExistentKey';
		const target = {};
		const propertyKey = 'testProperty';

		const result = getMetadata(metadataKey, target, propertyKey);
		expect(result).toBeUndefined();
	});

	it('should call Reflect.getMetadata with correct arguments for a class', () => {
		const metadataKey = 'testKey';
		const target = class {};

		getMetadata(metadataKey, target);

		expect(getMetadataSpy).toHaveBeenCalledWith(metadataKey, target);
	});

	it('should call Reflect.getMetadata with correct arguments for a class property', () => {
		const metadataKey = 'testKey';
		const target = {};
		const propertyKey = 'testProperty';

		getMetadata(metadataKey, target, propertyKey);

		expect(getMetadataSpy).toHaveBeenCalledWith(
			metadataKey,
			target,
			propertyKey
		);
	});
});
