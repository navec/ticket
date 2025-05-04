import { Inject, Injectable } from '@core/decorators';

import {
	AuthProvider,
	AuthStrategyFactoryPort,
	Credentials,
} from '@auth/domain';
import { AUTH_STRATEGY_FACTORY } from '@auth/shared';

@Injectable()
export class LoginUseCase {
	constructor(
		@Inject(AUTH_STRATEGY_FACTORY)
		private readonly factory: AuthStrategyFactoryPort
	) {}

	async execute(input: { provider: AuthProvider; credentials: Credentials }) {
		const strategy = this.factory.getStrategy(input.provider);
		return await strategy.authenticate(input.credentials);
	}
}
