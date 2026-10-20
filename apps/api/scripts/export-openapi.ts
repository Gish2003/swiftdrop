/**
 * Writes apps/api/openapi.json WITHOUT starting the server or touching the database
 * (connections are lazy). Used by `pnpm gen:api` to generate the web app's typed client.
 */
import './openapi-env';
import 'reflect-metadata';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { buildOpenApiDocument, configureApp } from '../src/app.factory';
import { loadEnv } from '../src/config/env';

async function main() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
    abortOnError: false,
    preview: true,
  });
  configureApp(app, loadEnv()); // preview mode: providers are not instantiated
  const doc = buildOpenApiDocument(app);
  const out = join(process.cwd(), 'openapi.json');
  writeFileSync(out, JSON.stringify(doc, null, 2));
  console.warn(`OpenAPI written to ${out}`);
  await app.close();
}

void main();
