import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import type { Response } from 'express';
import { Public } from '../../common/auth';
import { RabbitMqService } from '../../infra/events';
import { PrismaService } from '../../infra/prisma';
import { StorageService } from '../../infra/storage';

/** Owner: M10. Used by Docker healthchecks, CI and the gateway. */
@ApiTags('health')
@Controller('health')
@Public()
@SkipThrottle()
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbit: RabbitMqService,
    private readonly storage: StorageService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Liveness + dependency status' })
  async check(@Res({ passthrough: true }) res: Response) {
    const [db, storage] = await Promise.all([
      this.prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false),
      this.storage.ping(),
    ]);
    const checks = { db, rabbitmq: this.rabbit.isConnected(), storage };
    const ok = checks.db && checks.rabbitmq;
    res.status(ok ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE);
    return { status: ok ? 'ok' : 'degraded', checks, time: new Date().toISOString() };
  }
}
