import { Global, Inject, Module } from '@nestjs/common';
import { Env, loadEnv } from './env';

export const APP_CONFIG = Symbol('APP_CONFIG');

/** Inject typed config: `constructor(@InjectConfig() private readonly config: Env) {}` */
export const InjectConfig = () => Inject(APP_CONFIG);

@Global()
@Module({
  providers: [{ provide: APP_CONFIG, useFactory: (): Env => loadEnv() }],
  exports: [APP_CONFIG],
})
export class ConfigModule {}

export type { Env };
