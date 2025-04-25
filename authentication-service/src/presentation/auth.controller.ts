import { BodyParam, Controller, Post } from 'core';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case';
import { LoginUserUseCase } from '../use-cases/login-user.use-case';
import { LoginUserDto } from '../use-cases/dtos/login-user.dto';
import { CreateUserDto } from '@use-cases/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly registerUserUseCase: RegisterUserUseCase,
		private readonly loginUserUseCase: LoginUserUseCase
	) {}

	@Post('/register')
	async register(@BodyParam() createUserDto: CreateUserDto) {
		return this.registerUserUseCase.execute(createUserDto);
	}

	@Post('/login')
	async login(@BodyParam('username') loginDto: LoginUserDto) {
		console.log('inside');
		return this.loginUserUseCase.execute(loginDto);
	}
}
