// Placeholder env so the OpenAPI export can boot the module graph without a real .env.
// Nothing connects anywhere (preview mode). Imported FIRST by export-openapi.ts.
const defaults: Record<string, string> = {
  DATABASE_URL: 'postgresql://openapi:openapi@localhost:5432/openapi',
  RABBITMQ_URL: 'amqp://localhost',
  JWT_ACCESS_SECRET: 'openapi-export-placeholder-secret-0123456789',
  JWT_REFRESH_SECRET: 'openapi-export-placeholder-secret-0123456789',
  S3_ACCESS_KEY: 'openapi',
  S3_SECRET_KEY: 'openapi',
  WEBHOOK_SECRET_ENC_KEY: 'b3BlbmFwaS1leHBvcnQtcGxhY2Vob2xkZXIta2V5ISE=',
};
for (const [k, v] of Object.entries(defaults)) process.env[k] ??= v;
