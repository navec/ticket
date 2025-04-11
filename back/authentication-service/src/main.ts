import {AppModule} from './app.module';
import {AppBootFactory, ValidatorType} from 'core';

const port = 3000;
const hostname = 'localhost';

async function bootstrap() {
  const app = await AppBootFactory.create(AppModule);
  app.useValidator(ValidatorType.ZOD);

  await app.listen(3000, () => {
    console.log(
      '\x1b[33m',
      `[INFO] : Server running at http://${hostname}:${port}/`
    );
  });
}

void bootstrap();
