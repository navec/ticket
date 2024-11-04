export class LoginUserDto {
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}
