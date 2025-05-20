import { Inject, Injectable, BadRequestException } from '@ticket/core';

import { AuthServicePort, EmailPasswordCredentials } from '@auth/domain';
import { EMAIL_PASSWORD_AUTH_SERVICE } from '@auth/shared';

@Injectable()
export class EmailPasswordAuthUseCase {
	constructor(
		@Inject(EMAIL_PASSWORD_AUTH_SERVICE)
		private readonly emailPasswordAuthService: AuthServicePort
	) {}

	async execute(
		credentials: EmailPasswordCredentials & { confirmPassword: string }
	) {
		if (credentials.confirmPassword !== credentials.password) {
			throw new BadRequestException(
				'Password and confirmPassword do not match'
			);
		}
		return this.emailPasswordAuthService.authenticate(credentials);
	}
}
