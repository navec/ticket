import { BodyParam, Controller, Post } from '@core/decorators';
import { AuthProvider } from '@auth/domain';
import { LoginUseCase } from '@auth/application';
import { CredentialsDto } from '../dtos/credentials.dto';

@Controller()
export class AuthController {
	constructor(private readonly loginUseCase: LoginUseCase) {}

	@Post('login')
	login(
		@BodyParam() credentials: CredentialsDto,
		provider = AuthProvider.DEFAULT
	) {
		return this.loginUseCase.execute(provider, credentials);
	}
}
