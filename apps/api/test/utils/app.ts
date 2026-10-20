/**
 * Integration-test helpers. Usage:
 *
 *   let t: TestContext;
 *   beforeAll(async () => (t = await createTestApp()));
 *   afterAll(() => t.close());
 *
 *   await request(t.http).get('/api/v1/parcels/mine').set('Cookie', await t.cookieFor('CUSTOMER')).expect(200);
 */
import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AUTH_COOKIES, type Role } from '@swiftdrop/contracts';
import type { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/app.factory';
import { TokenService } from '../../src/common/auth';
import { APP_CONFIG } from '../../src/config/config.module';
import type { Env } from '../../src/config/env';
import { PrismaService } from '../../src/infra/prisma';

export interface TestContext {
  app: INestApplication;
  http: App;
  prisma: PrismaService;
  /** Cookie header for the first seeded user with this role (or a specific email). */
  cookieFor(role: Role, email?: string): Promise<string>;
  close(): Promise<void>;
}

export async function createTestApp(): Promise<TestContext> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication({ logger: ['error'] });
  configureApp(app, app.get<Env>(APP_CONFIG));
  await app.init();

  const prisma = app.get(PrismaService);
  const tokens = app.get(TokenService);

  return {
    app,
    http: app.getHttpServer(),
    prisma,
    async cookieFor(role, email) {
      const user = await prisma.user.findFirstOrThrow({
        where: email ? { email } : { role },
        orderBy: { email: 'asc' },
      });
      const token = await tokens.signAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      return `${AUTH_COOKIES.ACCESS}=${token}`;
    },
    close: () => app.close(),
  };
}
