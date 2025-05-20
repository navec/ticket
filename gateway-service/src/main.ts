import { AppBootFactory } from '@ticket/core';
import { ValidatorType } from '@ticket/core';

import { AuthModule } from '@auth/auth.module';
import { env } from 'node:process';

const port = Number(env.PORT || 3000);
const hostname = env.HOSTNAME || 'localhost';

async function bootstrap() {
	const app = await AppBootFactory.create(AuthModule);
	app.useValidator(ValidatorType.ZOD);

	await app.listen(port, () => {
		console.log(
			'\x1b[33m',
			`[INFO] : Server running at http://${hostname}:${port}/`
		);
	});
}

void bootstrap();
