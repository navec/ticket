import { Module } from '@core/decorators';
import { AuthController } from '@auth/presentations';
import { LoginUseCase } from '@auth/application';
import {
	AuthStrategyFactory,
	GoogleAuthStrategy,
	DefaultAuthStrategy,
	UserRepositoryInMemory,
	JwtService,
} from '@auth/infrastructure';

@Module({
	controllers: [AuthController],
	providers: [
		LoginUseCase,
		AuthStrategyFactory,
		DefaultAuthStrategy,
		GoogleAuthStrategy,
		UserRepositoryInMemory,
		JwtService,
	],
})
export class AppModule {}
