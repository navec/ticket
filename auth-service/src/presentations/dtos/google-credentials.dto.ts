import { DtoSchema } from '@ticket/core';

import { z } from 'zod';

const GoogleCredentialsSchema = z.object({
	code: z.string(),
});

@DtoSchema(GoogleCredentialsSchema)
export class GoogleCredentialsDto {
	constructor(readonly code: string) {}
}
