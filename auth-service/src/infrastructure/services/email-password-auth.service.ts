import { createHash, timingSafeEqual } from 'node:crypto';

import { Inject, Injectable, UnauthorizedException } from '@ticket/core';

import {
	ALGORITHM,
	AuthServicePort,
	ENCODING,
	JwtServicePort,
	EmailPasswordCredentials,
	UserRepositoryPort,
} from '@auth/domain';
import {
	EMAIL_PASSWORD_AUTH_SERVICE,
	JWT_SERVICE,
	USER_REPOSITORY_IN_MEMORY,
} from '@auth/shared';

@Injectable(EMAIL_PASSWORD_AUTH_SERVICE)
export class EmailPasswordAuthService extends AuthServicePort {
	constructor(
		@Inject(USER_REPOSITORY_IN_MEMORY)
		private readonly userRepository: UserRepositoryPort,
		@Inject(JWT_SERVICE)
		private readonly jwtService: JwtServicePort
	) {
		super();
	}

	private isValidPassword(
		passwordHash: string,
		inputPassword: string
	): boolean {
		const hashedPassword = createHash(ALGORITHM.SHA256)
			.update(createHash(ALGORITHM.SHA256).update(inputPassword).digest())
			.digest(ENCODING.HEX);

		return timingSafeEqual(
			Buffer.from(passwordHash),
			Buffer.from(hashedPassword)
		);
	}

	async authenticate({
		email,
		password,
	}: EmailPasswordCredentials): Promise<{ token: string; email: string }> {
		const user = await this.userRepository.findByEmail(email);

		if (
			!user ||
			(user.passwordHash && !this.isValidPassword(user.passwordHash, password))
		) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const token = this.jwtService.sign({ payload: { email } });

		return { token, email };
	}
}
