import { Injectable } from '@core/decorators';
import { NotImplementedException } from '@core/exceptions';

import { AuthStrategyPort, Credentials, UserLogin } from '@auth/domain';
import { GOOGLE_AUTH_STRATEGY } from '@auth/shared';

@Injectable(GOOGLE_AUTH_STRATEGY)
export class GoogleAuthStrategy extends AuthStrategyPort {
	authenticate(credentials: Credentials): Promise<UserLogin> {
		throw new NotImplementedException('Method not implemented.', credentials);
	}
}
