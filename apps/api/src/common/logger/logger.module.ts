import { randomUUID } from 'node:crypto';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import type { Env } from '../../config/env';
import { APP_CONFIG } from '../../config/config.module';

/**
 * Structured logging. Secrets and personal data are redacted — never log raw request bodies,
 * tokens, API keys, passwords, addresses or phone numbers. See docs/conventions/security.md.
 */
export const LoggerModule = PinoLoggerModule.forRootAsync({
  inject: [APP_CONFIG],
  useFactory: (config: Env) => ({
    pinoHttp: {
      level: config.LOG_LEVEL,
      // id is assigned earlier by requestContextMiddleware
      genReqId: (req) => (req as { id?: string }).id ?? randomUUID(),
      redact: {
        paths: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.headers["x-api-key"]',
          'res.headers["set-cookie"]',
          '*.password',
          '*.passwordHash',
          '*.token',
          '*.apiKey',
          '*.secret',
        ],
        censor: '[REDACTED]',
      },
      autoLogging: { ignore: (req) => req.url?.includes('/health') ?? false },
      transport:
        config.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { singleLine: true, translateTime: 'SYS:HH:MM:ss' } }
          : undefined,
    },
  }),
});
