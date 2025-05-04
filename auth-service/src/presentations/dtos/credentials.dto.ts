import { AuthProvider } from '@auth/domain';
import { DtoSchema } from '@core/decorators';

import { z } from 'zod';

const DefaultLoginSchema = z
	.object({
		provider: z.literal(AuthProvider.DEFAULT),
		credentials: z.object({
			email: z.string().email(),
			password: z.string().min(8),
		}),
	})
	.strict();

const GoogleLoginSchema = z
	.object({
		provider: z.literal(AuthProvider.GOOGLE),
		credentials: z.object({ code: z.string() }),
	})
	.strict();

const LoginSchema = z.union([DefaultLoginSchema, GoogleLoginSchema]);
type Login = z.output<typeof LoginSchema>;

@DtoSchema(LoginSchema)
export class LoginDto {
	provider: Login['provider'];
	credentials: Login['credentials'];

	constructor(dto: z.output<typeof GoogleLoginSchema>);
	constructor(dto: z.output<typeof DefaultLoginSchema>);
	constructor(private readonly dto: Login) {
		this.provider = this.dto.provider;
		this.credentials = this.dto.credentials;
	}
}
