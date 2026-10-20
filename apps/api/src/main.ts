import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { configureApp, setupSwagger } from './app.factory';
import { APP_CONFIG } from './config/config.module';
import type { Env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  const config = app.get<Env>(APP_CONFIG);
  configureApp(app, config);
  if (config.NODE_ENV !== 'production') setupSwagger(app);
  await app.listen(config.PORT, '0.0.0.0');
}

void bootstrap();
