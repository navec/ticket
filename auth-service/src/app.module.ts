import { Module } from '@core/decorators';
import { AuthController } from '@auth/presentations';
import { LoginUseCase } from '@auth/application';
import {
	AuthStrategyFactory,
	GoogleAuthStrategy,
	JwtAuthStrategy,
	LocalAuthStrategy,
} from '@auth/infrastructure';

@Module({
	controllers: [AuthController],
	providers: [
		LoginUseCase,
		AuthStrategyFactory,
		LocalAuthStrategy,
		GoogleAuthStrategy,
		JwtAuthStrategy,
	],
})
export class AppModule {}
