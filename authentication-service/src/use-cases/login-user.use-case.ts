import { Injectable } from 'core/decorators';
import {
	BadRequestException,
	ForbiddenException,
	NotFoundException,
} from 'core/exceptions';

import { AuthService } from '@business/auth.service';
import { AuthRepositoryInMemory } from '@infrastructure/auth.repository';
import { UserProfile } from '@business/entities/user-profile.entity';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class LoginUserUseCase {
	constructor(
		private readonly authService: AuthService,
		private readonly authRepository: AuthRepositoryInMemory
	) {}

	async execute({ email, password }: LoginUserDto): Promise<UserProfile> {
		try {
			const user = this.authRepository.findUserLoginByEmail(email);
			if (!user) {
				throw new NotFoundException('User not found');
			}

			const isValid = await this.authService.validatePassword(
				password,
				user.password
			);
			if (!isValid) {
				throw new BadRequestException('Password not valid');
			}
			return { email: user.email };
		} catch (error) {
			throw new ForbiddenException('connection not allowed', error);
		}
	}
}
