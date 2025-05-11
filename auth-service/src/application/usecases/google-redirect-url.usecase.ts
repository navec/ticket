import { Inject, Injectable } from '@core/decorators';

import { AuthRedirectUrlPort } from '@auth/domain';
import { GOOGLE_AUTH_REDIRECT_URL_SERVICE } from '@auth/shared';

@Injectable()
export class GoogleRedirectUrlUseCase {
	constructor(
		@Inject(GOOGLE_AUTH_REDIRECT_URL_SERVICE)
		private readonly googleAuthRedirectUrl: AuthRedirectUrlPort
	) {}

	async execute() {
		return this.googleAuthRedirectUrl.generateRedirectUrl();
	}
}
