import {Injectable} from 'core';
import {AuthService} from '../business/auth.service';
import {AuthRepositoryInMemory} from '../infrastructure/auth.repository';
import {LoginUserDto} from '../use-cases/dtos/login-user.dto';
import {UserProfile} from '../business/entities/user-profile.entity';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly authRepository: AuthRepositoryInMemory
  ) {}

  async execute({email, password}: LoginUserDto): Promise<UserProfile> {
    try {
      const user = this.authRepository.findUserLoginByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      const isValid = await this.authService.validatePassword(
        password,
        user.password
      );
      if (!isValid) {
        throw new Error('Password not valid');
      }
      // Retourne le profile de l'utilisateur
      return {email: user.email};
    } catch (error) {
      throw new Error(
        JSON.stringify({
          // code: HttpStatusCode.FORBIDDEN,
          message: 'connection not allowed',
        })
      );
    }
  }
}
