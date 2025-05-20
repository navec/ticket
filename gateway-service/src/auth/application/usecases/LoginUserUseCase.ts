import { Injectable, Inject } from '@ticket/core';
import { AuthServicePort } from '@auth/domain/ports/AuthServicePort';

@Injectable()
export class LoginUseCase {
	constructor(
		@Inject('HttpAuthService')
		private readonly authService: AuthServicePort
	) {}

	execute(credential: { email: string; password: string }) {
		return this.authService.login(credential);
	}
}
