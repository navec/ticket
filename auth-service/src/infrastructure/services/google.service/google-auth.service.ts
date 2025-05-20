import { Inject, Injectable, UnauthorizedException } from '@ticket/core';

import {
	AuthServicePort,
	GoogleCredentials,
	JwtServicePort,
	AuthenticatedUser,
	UserRepositoryPort,
} from '@auth/domain';
import {
	GOOGLE_AUTH_SERVICE,
	JWT_SERVICE,
	USER_REPOSITORY_IN_MEMORY,
} from '@auth/shared';
import { googleClient } from '@auth/infrastructure';

@Injectable(GOOGLE_AUTH_SERVICE)
export class GoogleAuthService extends AuthServicePort {
	constructor(
		@Inject(USER_REPOSITORY_IN_MEMORY)
		private readonly userRepository: UserRepositoryPort,
		@Inject(JWT_SERVICE)
		private readonly jwtService: JwtServicePort
	) {
		super();
	}

	async authenticate({ code }: GoogleCredentials): Promise<AuthenticatedUser> {
		const { tokens } = await googleClient.getToken(code);
		const ticket = await googleClient.verifyIdToken({
			idToken: tokens.id_token!,
			audience: googleClient._clientId,
		});
		const payload = ticket.getPayload();

		if (!payload?.email || !payload?.email_verified || !payload?.exp) {
			throw new UnauthorizedException('Google e-mail is missing or invalid');
		}

		if (payload.exp < Date.now() / 1000) {
			throw new UnauthorizedException('Google token is expired');
		}

		const email = payload.email;
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			this.userRepository.create({
				email,
				provider: 'google',
				passwordHash: null,
			});
		}

		return { token: this.jwtService.sign({ payload: { email } }), email };
	}
}
