import {Injectable} from 'core';
import {AuthService} from '../business/auth.service';
import {AuthRepositoryInMemory} from '../infrastructure/auth.repository';
import {CreateUserDto} from '../use-cases/dtos/create-user.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly authRepository: AuthRepositoryInMemory
  ) {}

  async execute({email, password}: CreateUserDto) {
    const existingUser = this.authRepository.findUserLoginByEmail(email);
    if (existingUser) {
      throw new Error(
        JSON.stringify({
          // code: HttpStatusCode.BAD_REQUEST,
          message: 'User already exists',
        })
      );
    }
    const hashedPassword = await this.authService.hashPassword(password);
    return this.authRepository.create({email, password: hashedPassword});
  }
}
