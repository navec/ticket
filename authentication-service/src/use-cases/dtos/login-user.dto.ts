import { DtoSchema } from 'core';
import { z } from 'zod';

const LoginUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

@DtoSchema(LoginUserSchema)
export class LoginUserDto {
	email!: string;
	password!: string;
}
