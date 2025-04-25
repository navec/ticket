import { z } from 'zod';
import { ValidatorAdapter } from '@core/adapters/abstracts/validator.adapter';
import { BadRequestException } from '@core/exceptions';

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
