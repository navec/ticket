import { METHOD_METADATA, PATH_METADATA } from '@core/constants';
import { getMetadata } from '@core/decorators';
import { HttpMethod } from '@core/enums';
import { ControllersRegistry, EndpointsRegistry } from '@core/registries';
import { UnknownFunction } from '@core/types';

export class RouterRegistry {
	public register() {
		const controllers = ControllersRegistry.keys();

		controllers.forEach((controller) => {
			const instance = ControllersRegistry.get(controller)?.instance;
			if (!instance) {
				// TODO: Add warning log here
				return;
			}

			const controllerInstance = instance as Record<
				string | symbol,
				UnknownFunction
			>;
			const basePath = getMetadata(PATH_METADATA, controller);
			const methods = Reflect.ownKeys(controller.prototype);

			methods
				.filter(
					(methodName) =>
						methodName !== 'constructor' &&
						getMetadata(PATH_METADATA, controllerInstance[methodName])
				)
				.forEach((methodName) => {
					const method = controllerInstance[methodName];
					const path: string = getMetadata(PATH_METADATA, method);
					const type = getMetadata(METHOD_METADATA, method);
					const boundMethod = method.bind(controllerInstance);
					console.log(
						'\x1b[33m',
						`[INFO] : ${HttpMethod[type]} ${basePath}${path} of ${methodName.toString()} in ${controller.name} controller`
					);
					EndpointsRegistry.register(basePath ? `/${basePath}${path}` : path, {
						controller: controllerInstance,
						method: { bound: boundMethod, name: methodName.toString() },
					});
				});
		});
	}
}
