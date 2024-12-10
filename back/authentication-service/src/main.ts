import {AppModule} from './app.module';
import {AppBootFactory} from './core/boot';

const port = 3000;
const hostname = 'localhost';

async function bootstrap() {
  const app = await AppBootFactory.create(AppModule);
  app.listen(3000, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

bootstrap();
