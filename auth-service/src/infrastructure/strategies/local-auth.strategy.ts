import { Injectable } from '@core/decorators';
import { NotImplementedException } from '@core/exceptions';

import { AuthStrategyPort, Credentials } from '@auth/domain';
import { LOCAL_AUTH_STRATEGY } from '@auth/shared';

@Injectable(LOCAL_AUTH_STRATEGY)
export class LocalAuthStrategy extends AuthStrategyPort {
	authenticate(credentials: Credentials): Promise<any> {
		throw new NotImplementedException('Method not implemented.');
	}
}
