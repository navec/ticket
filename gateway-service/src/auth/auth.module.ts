import { Module } from '@core/decorators';
import { HttpAuthController } from '@auth/presentation/controllers/http-auth.controller';
import { LoginUseCase } from '@auth/application/usecases/LoginUserUseCase';
import { HttpAuthService } from '@auth/infrastructure/services/HttpAuthService';

@Module({
	controllers: [HttpAuthController],
	providers: [LoginUseCase, HttpAuthService],
})
export class AuthModule {}
