import { PROVIDER_SCOPE_METADATA } from '@core/constants';
import { getMetadata } from '@core/decorators';
import { ControllersRegistry } from '@core/registries';
import { Constructor } from '@core/types';

export class ControllerScanner {
	public static scan(controllers: Constructor[]) {
		controllers.forEach((controller: Constructor) => {
			const metadata = getMetadata(PROVIDER_SCOPE_METADATA, controller);
			if (metadata.type !== 'controller') {
				const message = `controller type is required, currently we have ${metadata.type} type`;
				throw new Error(message);
			}

			ControllersRegistry.register(controller);
		});
	}
}
