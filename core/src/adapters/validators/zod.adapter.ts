import { z } from 'zod';
import { BadRequestException } from '@core/exceptions';
import { ValidatorAdapter } from '@core/adapters';

export class ZodAdapter extends ValidatorAdapter {
	async validate(schemas: z.ZodSchema[], data: unknown[]) {
		try {
			schemas.forEach((schema, index: number) => schema.parse(data[index]));
		} catch (error) {
			const message = (error as z.ZodError).issues
				.map((err) => `${err.path.join('.')}: ${err.message}`)
				.join(' - ');
			throw new BadRequestException(message, error);
		}
	}
}
