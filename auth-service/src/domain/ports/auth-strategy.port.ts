import { Credentials } from '@auth/domain';

export abstract class AuthStrategyPort {
	abstract authenticate(
		credentials: Credentials
	): Promise<{ token: string; email: Credentials['email'] }>;
}
