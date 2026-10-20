import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    logger: [
      'log',
      'warn',
      'error',
      ...(process.env.LOG_LEVEL === 'debug' ? (['debug'] as const) : []),
    ],
  });
  app.enableShutdownHooks();
  new Logger('Worker').log('SwiftDrop worker started');
}

void bootstrap();
