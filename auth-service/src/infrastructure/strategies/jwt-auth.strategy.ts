import { Injectable } from '@core/decorators';
import { NotImplementedException } from '@core/exceptions';

import { AuthStrategyPort, Credentials } from '@auth/domain';
import { JWT_AUTH_STRATEGY } from '@auth/shared';

@Injectable(JWT_AUTH_STRATEGY)
export class JwtAuthStrategy extends AuthStrategyPort {
	authenticate(credentials: Credentials): Promise<any> {
		throw new NotImplementedException('Method not implemented.');
	}
}
