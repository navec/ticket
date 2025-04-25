import { ServerType } from '@core/enums';
import { ServerAdapter } from '@core/adapters';
import { Constructor } from '@core/types';

import { AppBuilder } from './app.builder';
import { SERVER_TYPE_ADAPTER_REGISTRY } from './app.constants';

class AppFactory {
	getServer(type = ServerType.HTTP_SERVER): ServerAdapter {
		const Adapter = SERVER_TYPE_ADAPTER_REGISTRY[type];

		if (!Adapter || Adapter === null) {
			throw new Error(`Unsupported or unimplemented server type: ${type}`);
		}

		return new Adapter();
	}

	async create(module: Constructor, opt?: { type?: ServerType }) {
		return new AppBuilder()
			.setModule(module)
			.setServer(this.getServer(opt?.type))
			.build();
	}
}

export const AppBootFactory = new AppFactory();
