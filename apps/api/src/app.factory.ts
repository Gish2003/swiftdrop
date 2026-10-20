/**
 * Shared HTTP app configuration — used by main.ts, the OpenAPI exporter and integration tests,
 * so all three behave identically. Owner: M1.
 */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';
import { AUTH_COOKIES, MERCHANT_API_KEY_HEADER } from '@swiftdrop/contracts';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import type { Env } from './config/env';
import { requestContextMiddleware } from './common/request-context/request-context';

export const SWAGGER_TAGS = [
  'health',
  'auth',
  'users',
  'bookings',
  'tracking',
  'pricing',
  'dispatch',
  'courier',
  'merchants',
  'merchant-api',
  'admin',
  'reports',
  'audit',
  'event-ops',
  'dev',
] as const;

export function configureApp(app: INestApplication, config: Env) {
  app.use(requestContextMiddleware);
  app.setGlobalPrefix('api/v1');
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({ origin: config.CORS_ORIGINS.split(','), credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks();
}

export function buildOpenApiDocument(app: INestApplication): OpenAPIObject {
  const builder = new DocumentBuilder()
    .setTitle('SwiftDrop API')
    .setDescription(
      'REST API for SwiftDrop. Errors: `{ error: { code, message, details, requestId } }`. ' +
        'Browser clients authenticate with the httpOnly `sd_access` cookie; Swagger can use a Bearer token. ' +
        'Partner endpoints under /merchant use the `X-Api-Key` header.',
    )
    .setVersion('1.0')
    .addCookieAuth(AUTH_COOKIES.ACCESS)
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', in: 'header', name: MERCHANT_API_KEY_HEADER }, 'merchant-api-key');
  for (const tag of SWAGGER_TAGS) builder.addTag(tag);
  return SwaggerModule.createDocument(app, builder.build());
}

export function setupSwagger(app: INestApplication) {
  SwaggerModule.setup('api/docs', app, () => buildOpenApiDocument(app), {
    jsonDocumentUrl: 'api/docs-json',
    swaggerOptions: { persistAuthorization: true },
  });
}
