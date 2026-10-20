import { Global, Inject, Module } from '@nestjs/common';
import { loadEnv, type WorkerEnv } from './env';

export const WORKER_CONFIG = Symbol('WORKER_CONFIG');
export const InjectConfig = () => Inject(WORKER_CONFIG);

@Global()
@Module({
  providers: [{ provide: WORKER_CONFIG, useFactory: (): WorkerEnv => loadEnv() }],
  exports: [WORKER_CONFIG],
})
export class ConfigModule {}

export type { WorkerEnv };
