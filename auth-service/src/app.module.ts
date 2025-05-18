import { Module } from '@ticket/core';
import { AuthController } from '@auth/presentations';
import {
	EmailPasswordAuthUseCase,
	GoogleAuthUseCase,
	GoogleRedirectUrlUseCase,
} from '@auth/application';
import {
	GoogleAuthService,
	EmailPasswordAuthService,
	UserRepositoryInMemory,
	JwtService,
} from '@auth/infrastructure';
import { GoogleAuthRedirectUrlService } from './infrastructure/services/google.service/google-auth-redirect-url.service';

@Module({
	controllers: [AuthController],
	providers: [
		// Use Cases
		EmailPasswordAuthUseCase,
		GoogleRedirectUrlUseCase,
		GoogleAuthUseCase,

		// Repositories
		UserRepositoryInMemory,

		// Services
		JwtService,
		EmailPasswordAuthService,
		GoogleAuthService,
		GoogleAuthRedirectUrlService,
	],
})
export class AppModule {}
