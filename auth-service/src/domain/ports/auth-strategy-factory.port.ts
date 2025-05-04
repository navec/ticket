import { AuthProvider, AuthStrategyPort } from '@auth/domain';

export abstract class AuthStrategyFactoryPort {
	abstract getStrategy(provider: AuthProvider): AuthStrategyPort;
}
