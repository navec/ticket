import { BodyParam, Controller, Get, Post, QueryParam } from '@ticket/core';
import {
	EmailPasswordAuthUseCase,
	GoogleAuthUseCase,
	GoogleRedirectUrlUseCase,
} from '@auth/application';
import { EmailPasswordCredentialsDto } from '@auth/presentations';
import { GoogleCredentialsDto } from '../dtos/google-credentials.dto';

@Controller('auth')
export class AuthController {
	constructor(
		// Email and Password
		private readonly emailPasswordAuthUseCase: EmailPasswordAuthUseCase,

		// Google
		private readonly googleRedirectUrlUseCase: GoogleRedirectUrlUseCase,
		private readonly googleAuthUseCase: GoogleAuthUseCase
	) {}

	@Post('email-password')
	loginByEmailPassword(
		@BodyParam() emailPassword: EmailPasswordCredentialsDto
	) {
		return this.emailPasswordAuthUseCase.execute(emailPassword);
	}

	@Get('google/redirect')
	urlRedirectToGoogle() {
		return this.googleRedirectUrlUseCase.execute();
	}

	@Get('google/callback')
	loginByGoogleCode(@QueryParam() { code }: GoogleCredentialsDto) {
		return this.googleAuthUseCase.execute({ code });
	}
}
