import { AppBootFactory, ValidatorType } from '@ticket/core';

import { AppModule } from './app.module';
import { env } from 'node:process';

const port = Number(env.PORT || 3001);
const hostname = env.HOSTNAME || 'localhost';

async function bootstrap() {
	const app = await AppBootFactory.create(AppModule);
	app.useValidator(ValidatorType.ZOD);

	await app.listen(port, () => {
		console.log(
			'\x1b[33m',
			`[INFO] : Server running at http://${hostname}:${port}/`
		);
	});
}

void bootstrap();
