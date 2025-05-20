import { DtoSchema } from '@ticket/core';

import { z } from 'zod';

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

@DtoSchema(LoginSchema)
export class LoginDto {
	email!: string;
	password!: string;
}
