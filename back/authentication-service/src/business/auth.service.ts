import {Injectable, InjectableBis} from 'core';
import {createHash} from 'crypto';

@InjectableBis()
@Injectable()
export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return createHash('sha256').update(password, 'utf8').digest('hex');
  }

  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const currentPwdHashed = await this.hashPassword(password);
    return currentPwdHashed === hashedPassword;
  }

  // generateJwtToken(user: User): string {
  //   return this.jwtService.sign({id: user.id, roles: user.roles});
  // }
}
