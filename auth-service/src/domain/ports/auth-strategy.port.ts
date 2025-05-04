import { Credentials, UserLogin } from '@auth/domain';

export abstract class AuthStrategyPort {
	abstract authenticate(credentials: Credentials): Promise<UserLogin>;
}
