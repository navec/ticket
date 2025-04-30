import 'reflect-metadata';
import {
	BODY_PARAM_METADATA,
	QUERY_PARAM_METADATA,
	PATH_PARAM_METADATA,
	REQ_PARAM_METADATA,
	RES_PARAM_METADATA,
	SCHEMA_PARAM_METADATA,
} from '@core/constants';
import {
	BodyParam,
	QueryParam,
	PathParam,
	ReqParam,
	ResParam,
} from '@core/decorators';

describe('Param decorator', () => {
	const defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
	const getMetadataSpy = jest.spyOn(Reflect, 'getMetadata');

	afterEach(() => {
		defineMetadataSpy.mockClear();
		getMetadataSpy.mockClear();
	});

	it('should throw an error if propertyKey is undefined', () => {
		const target = Object.create({});
		const index = 0;

		const paramDecoratorFn = () => BodyParam()(target, undefined, index);

		expect(paramDecoratorFn).toThrow('property of BodyParam is required');
	});

	it.each([
		{ callback: BodyParam, metadata: BODY_PARAM_METADATA },
		{ callback: QueryParam, metadata: QUERY_PARAM_METADATA },
		{ callback: PathParam, metadata: PATH_PARAM_METADATA },
		{ callback: ReqParam, metadata: REQ_PARAM_METADATA },
		{ callback: ResParam, metadata: RES_PARAM_METADATA },
	])(
		'should add $metadata metadata for the parameter',
		({ callback, metadata }) => {
			const target = Object.create({});
			const [method, index, key] = ['method', 0, 'key'];

			callback(key)(target, method, index);

			expect(defineMetadataSpy).toHaveBeenCalledWith(
				metadata,
				[{ key, index }],
				target,
				method
			);
		}
	);

	it('should add metadata for the parameter', () => {
		const target = Object.create({});
		const [method, index, key] = ['method', 0, 'key'];
		getMetadataSpy.mockReturnValueOnce([]);

		BodyParam(key)(target, method, index);

		expect(defineMetadataSpy).toHaveBeenCalledWith(
			BODY_PARAM_METADATA,
			[{ key, index }],
			target,
			method
		);
	});

	it('should add schema metadata if parameter is a DTO', () => {
		const mockDtoSchema = { prototype: { __isDTO: true } };
		const mockParamTypes = [mockDtoSchema];

		const target = Object.create({});
		const [method, index, key] = ['method', 0, 'key'];
		getMetadataSpy.mockReturnValueOnce([]).mockReturnValueOnce(mockParamTypes);

		QueryParam(key)(target, method, index);

		expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
		expect(defineMetadataSpy).toHaveBeenNthCalledWith(
			1,
			QUERY_PARAM_METADATA,
			[{ index, key }],
			target,
			method
		);

		expect(defineMetadataSpy).toHaveBeenNthCalledWith(
			2,
			SCHEMA_PARAM_METADATA,
			[{ index, dtodWithSchema: { prototype: { __isDTO: true } } }],
			target,
			method
		);
	});

	it('should not add schema metadata if parameter is not a DTO', () => {
		const target = Object.create({});
		const [method, index, key] = ['method', 0, 'key'];
		const mockParamTypes = [{}];
		getMetadataSpy.mockReturnValueOnce([]).mockReturnValueOnce(mockParamTypes);

		ReqParam(key)(target, method, index);

		expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
		expect(defineMetadataSpy).not.toHaveBeenCalledWith(
			SCHEMA_PARAM_METADATA,
			expect.anything(),
			target,
			method
		);
	});
});
