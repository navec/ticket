import { DtoSchema } from 'core/decorators';

import { z } from 'zod';

const CreateUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

@DtoSchema(CreateUserSchema)
export class CreateUserDto {
	email!: string;
	password!: string;
}
