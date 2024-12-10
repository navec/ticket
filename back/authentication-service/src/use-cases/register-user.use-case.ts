import {Inject, Injectable, InjectableBis} from 'core';
import {AuthService} from '../business/auth.service';
import {AuthRepositoryInMemory} from '../infrastructure/auth.repository';
import {HttpStatusCode} from 'core';
import {CreateUserDto} from '../use-cases/dtos/create-user.dto';

@InjectableBis()
@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject() private readonly authService: AuthService,
    @Inject() private readonly authRepository: AuthRepositoryInMemory
  ) {}

  async execute({email, password}: CreateUserDto) {
    const existingUser = this.authRepository.findUserLoginByEmail(email);
    if (existingUser) {
      throw new Error(
        JSON.stringify({
          code: HttpStatusCode.BAD_REQUEST,
          message: 'User already exists',
        })
      );
    }
    const hashedPassword = await this.authService.hashPassword(password);
    return this.authRepository.create({email, password: hashedPassword});
  }
}
