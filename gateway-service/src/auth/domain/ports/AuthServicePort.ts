export abstract class AuthServicePort {
	abstract login(credentials: {
		email: string;
		password: string;
	}): Promise<unknown>;
}
