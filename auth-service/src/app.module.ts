import { Module } from '@core/decorators';
import { AuthController } from './presentations/controllers/AuthController';

@Module({
	controllers: [AuthController],
})
export class AppModule {}
