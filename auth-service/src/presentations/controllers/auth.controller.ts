import { BodyParam, Controller, Post } from '@core/decorators';
import { LoginUseCase } from '@auth/application';
import { LoginDto } from '../dtos/credentials.dto';

@Controller()
export class AuthController {
	constructor(private readonly loginUseCase: LoginUseCase) {}

	@Post('login')
	login(@BodyParam() authInput: LoginDto) {
		return this.loginUseCase.execute(authInput);
	}
}
