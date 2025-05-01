import { DtoSchema } from '@core/decorators';

import { z } from 'zod';

const LocalCredentialsSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(8),
	})
	.strict();

const CredentialsSchema = LocalCredentialsSchema;

@DtoSchema(CredentialsSchema)
export class CredentialsDto {
	email!: string;
	password!: string;
}
