import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);

  console.log(`App started at port ${PORT}`);
}

bootstrap();
