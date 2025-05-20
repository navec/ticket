import { Inject, Injectable } from '@ticket/core';

import { AuthServicePort, GoogleCredentials } from '@auth/domain';
import { GOOGLE_AUTH_SERVICE } from '@auth/shared';

@Injectable()
export class GoogleAuthUseCase {
	constructor(
		@Inject(GOOGLE_AUTH_SERVICE)
		private readonly googleAuthService: AuthServicePort
	) {}

	async execute(credentials: GoogleCredentials) {
		return this.googleAuthService.authenticate(credentials);
	}
}
