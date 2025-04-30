import { BodyParam, Controller, Post } from '@core/decorators';

@Controller()
export class AuthController {
	@Post('login')
	login(@BodyParam() credential: { email: string; password: string }) {
		return credential;
	}
}
