export class CreateUserDto {
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}
