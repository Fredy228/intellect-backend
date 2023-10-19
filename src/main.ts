import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import * as process from 'process';

import { MainModule } from './main.module';
import { HttpExceptionFilter } from './error/http-exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    logger: ['error', 'warn', 'log'],
    cors: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  const PORT = process.env.PORT || 3333;

  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

bootstrap();
