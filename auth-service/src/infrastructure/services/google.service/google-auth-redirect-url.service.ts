import { Injectable } from '@core/decorators';

import { AuthRedirectUrlPort } from '@auth/domain';
import { GOOGLE_AUTH_REDIRECT_URL_SERVICE } from '@auth/shared';
import { googleClient } from '@auth/infrastructure';

@Injectable(GOOGLE_AUTH_REDIRECT_URL_SERVICE)
export class GoogleAuthRedirectUrlService extends AuthRedirectUrlPort {
	generateRedirectUrl(): Promise<string> | string {
		return googleClient.generateAuthUrl({
			access_type: 'offline',
			scope: ['openid', 'email', 'profile'],
		});
	}
}
