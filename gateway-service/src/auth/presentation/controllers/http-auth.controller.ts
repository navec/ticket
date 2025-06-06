import { Controller, Post, BodyParam } from '@ticket/core';

import { LoginUseCase } from '@auth/application/usecases/LoginUserUseCase';
import { LoginDto } from '@auth/presentation/dtos/login.dto';

@Controller()
export class HttpAuthController {
	constructor(private readonly loginUseCase: LoginUseCase) {}

	@Post('login')
	login(@BodyParam() credential: LoginDto) {
		return this.loginUseCase.execute(credential);
	}
}
