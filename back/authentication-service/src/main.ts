import {ServerAppFactory} from 'core';
import {AuthController} from './presentation';

async function bootstrap() {
  const app = ServerAppFactory.create([AuthController]);
  app.listen(3000);
}

bootstrap();
