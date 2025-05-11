import { DtoSchema } from '@core/decorators';

import { z } from 'zod';

const GoogleCredentialsSchema = z.object({
	code: z.string(),
});

@DtoSchema(GoogleCredentialsSchema)
export class GoogleCredentialsDto {
	constructor(readonly code: string) {}
}
