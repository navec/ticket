import { Module } from 'core/decorators';

import { RegisterUserUseCase } from '@use-cases/register-user.use-case';
import { LoginUserUseCase } from '@use-cases/login-user.use-case';
import { AuthService } from '@business/auth.service';
import { AuthRepositoryInMemory } from '@infrastructure/auth.repository';
import { AuthController } from '@presentation/auth.controller';

// TODO Create Auth module
@Module({
	controllers: [AuthController],
	providers: [
		RegisterUserUseCase,
		LoginUserUseCase,
		AuthService,
		AuthRepositoryInMemory,
	],
})
export class AppModule {}
