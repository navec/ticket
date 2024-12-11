import {Module} from 'core';

import {AuthController} from './presentation';
import {RegisterUserUseCase} from './use-cases/register-user.use-case';
import {LoginUserUseCase} from './use-cases/login-user.use-case';
import {AuthService} from './business/auth.service';
import {AuthRepositoryInMemory} from './infrastructure/auth.repository';

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
