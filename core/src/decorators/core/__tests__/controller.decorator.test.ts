import 'reflect-metadata';
import {
	CONTROLLER_METADATA,
	PATH_METADATA,
	PROVIDER_SCOPE_METADATA,
} from '@core/constants';
import { Controller } from '@core/decorators';
import { Scope } from '@core/enums';

describe('Controller Decorator', () => {
	it('should define metadata for controller type and singleton scope', () => {
		const testController = Object.create({});

		Controller()(testController);

		const providerScopeMetadata = Reflect.getMetadata(
			PROVIDER_SCOPE_METADATA,
			testController
		);
		expect(providerScopeMetadata).toEqual({
			type: 'controller',
			scope: Scope.SINGLETON,
		});
	});

	it('should define metadata for the default path', () => {
		const testController = Object.create({});

		Controller()(testController);

		const pathMetadata = Reflect.getMetadata(PATH_METADATA, testController);
		expect(pathMetadata).toBe('');
	});

	it('should define metadata for a custom path', () => {
		const testController = Object.create({});

		Controller('/custom-path')(testController);

		const pathMetadata = Reflect.getMetadata(PATH_METADATA, testController);
		expect(pathMetadata).toBe('custom-path');
	});

	it('should define controller metadata as true', () => {
		const testController = Object.create({});

		Controller('/custom-path')(testController);

		const controllerMetadata = Reflect.getMetadata(
			CONTROLLER_METADATA,
			testController
		);
		expect(controllerMetadata).toBe(true);
	});
});
