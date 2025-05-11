import { Credentials, AuthenticatedUser } from '@auth/domain';

export abstract class AuthServicePort {
	abstract authenticate(credentials: Credentials): Promise<AuthenticatedUser>;
}
