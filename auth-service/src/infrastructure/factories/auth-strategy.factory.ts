import { Injectable, Inject } from '@core/decorators';
import { NotFoundException } from '@core/exceptions';

import {
	AUTH_STRATEGY_FACTORY,
	LOCAL_AUTH_STRATEGY,
	GOOGLE_AUTH_STRATEGY,
	JWT_AUTH_STRATEGY,
} from '@auth/shared';
import {
	AuthProvider,
	AuthStrategyFactoryPort,
	AuthStrategyPort,
} from '@auth/domain';

@Injectable(AUTH_STRATEGY_FACTORY)
export class AuthStrategyFactory extends AuthStrategyFactoryPort {
	private readonly strategies = new Map<AuthProvider, AuthStrategyPort>();

	constructor(
		@Inject(LOCAL_AUTH_STRATEGY)
		private readonly localAuthStrategy: AuthStrategyPort,
		@Inject(GOOGLE_AUTH_STRATEGY)
		private readonly googleAuthStrategy: AuthStrategyPort,
		@Inject(JWT_AUTH_STRATEGY)
		private readonly jwtAuthStrategy: AuthStrategyPort
	) {
		super();
		this.strategies.set(AuthProvider.LOCAL, this.localAuthStrategy);
		this.strategies.set(AuthProvider.GOOGLE, this.googleAuthStrategy);
		this.strategies.set(AuthProvider.JWT, this.jwtAuthStrategy);
	}

	getStrategy(provider: AuthProvider): AuthStrategyPort {
		const strategy = this.strategies.get(provider);
		if (!strategy) {
			throw new NotFoundException(
				`Auth strategy for provider "${provider}" not found`
			);
		}
		return strategy;
	}
}
