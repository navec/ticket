import { DtoSchema } from '@core/decorators';

import { z } from 'zod';

const PasswordSchema = z.string().min(8);

const EmailPasswordCredentialsSchema = z
	.object({
		email: z.string().email(),
		password: PasswordSchema,
		confirmPassword: PasswordSchema,
	})
	.strict();

@DtoSchema(EmailPasswordCredentialsSchema)
export class EmailPasswordCredentialsDto {
	constructor(
		readonly email: string,
		readonly password: string,
		readonly confirmPassword: string
	) {}
}
