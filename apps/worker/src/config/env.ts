/** Worker environment — validated at boot. Add new vars here AND in /.env.example. Owner: M8. */
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.string().default('info'),
  WORKER_HEALTH_PORT: z.coerce.number().default(4100),
  DATABASE_URL: z.string().min(1),
  RABBITMQ_URL: z.string().min(1),

  OUTBOX_POLL_INTERVAL_MS: z.coerce.number().default(1000),
  OUTBOX_BATCH_SIZE: z.coerce.number().default(50),

  SMTP_HOST: z.string().default('mailpit'),
  SMTP_PORT: z.coerce.number().default(1025),
  MAIL_FROM: z.string().default('SwiftDrop <no-reply@swiftdrop.test>'),
  /** "email" sends via SMTP (Mailpit in dev); "log" only logs a masked line (mock SMS). */
  SMS_PROVIDER: z.enum(['log']).default('log'),

  WEBHOOK_TIMEOUT_MS: z.coerce.number().default(5000),
  /** Retry delays in ms; length = max retries before dead-lettering. */
  WEBHOOK_RETRY_DELAYS_MS: z
    .string()
    .default('10000,60000,300000')
    .transform((s) => s.split(',').map(Number)),
  WEBHOOK_SECRET_ENC_KEY: z.string().min(40),
  APP_URL: z.string().default('http://localhost:8080'),
});

export type WorkerEnv = z.infer<typeof envSchema>;

export function loadEnv(): WorkerEnv {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      'Invalid worker environment:\n' +
        parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n'),
    );
  }
  return parsed.data;
}
