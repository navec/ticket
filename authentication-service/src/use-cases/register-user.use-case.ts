import { AuthService } from '../business/auth.service';
import { AuthRepositoryInMemory } from '../infrastructure/auth.repository';
import { CreateUserDto } from '../use-cases/dtos/create-user.dto';
import { BadRequestException, Injectable } from 'core/src';

@Injectable()
export class RegisterUserUseCase {
	constructor(
		private readonly authService: AuthService,
		private readonly authRepository: AuthRepositoryInMemory
	) {}

	async execute({ email, password }: CreateUserDto) {
		if (!email || !password) {
			throw new BadRequestException('Email and password are required');
		}

		const existingUser = this.authRepository.findUserLoginByEmail(email);
		if (existingUser) {
			throw new BadRequestException('User already exists');
		}

		const hashedPassword = await this.authService.hashPassword(password);
		return this.authRepository.create({ email, password: hashedPassword });
	}
}
