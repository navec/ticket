import { createHash, timingSafeEqual } from 'node:crypto';

import { Inject, Injectable } from '@core/decorators';
import { UnauthorizedException } from '@core/exceptions';

import {
	ALGORITHM,
	AuthStrategyPort,
	ENCODING,
	JwtServicePort,
	LocalCredentials,
	UserRepositoryPort,
} from '@auth/domain';
import {
	DEFAULT_AUTH_STRATEGY,
	JWT_SERVICE,
	USER_REPOSITORY_IN_MEMORY,
} from '@auth/shared';

@Injectable(DEFAULT_AUTH_STRATEGY)
export class DefaultAuthStrategy extends AuthStrategyPort {
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
	}: LocalCredentials): Promise<{ token: string; email: string }> {
		const user = await this.userRepository.findByEmail(email);

		if (!user || !this.isValidPassword(user.passwordHash, password)) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const token = this.jwtService.sign({ payload: { email } });

		return { token, email };
	}
}
