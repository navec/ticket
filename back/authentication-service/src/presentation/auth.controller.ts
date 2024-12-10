import {
  BodyParam,
  Controller,
  ControllerBis,
  HttpStatus,
  HttpStatusCode,
  Inject,
  Post,
} from 'core';
import {RegisterUserUseCase} from '../use-cases/register-user.use-case';
import {LoginUserUseCase} from '../use-cases/login-user.use-case';
import {LoginUserDto} from '../use-cases/dtos/login-user.dto';
import {CreateUserDto} from '../use-cases/dtos/create-user.dto';

@ControllerBis('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject() private readonly registerUserUseCase: RegisterUserUseCase,
    @Inject() private readonly loginUserUseCase: LoginUserUseCase
  ) {}

  @Post('register')
  async register(@BodyParam() createUserDto: CreateUserDto) {
    return this.registerUserUseCase.execute(createUserDto);
  }

  @Post('login')
  @HttpStatus(HttpStatusCode.OK)
  async login(@BodyParam() loginDto: LoginUserDto) {
    return this.loginUserUseCase.execute(loginDto);
  }
}
