import { createServer, type Server } from 'node:http';
import { Injectable, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { InjectConfig, type WorkerEnv } from '../config/config.module';
import { PrismaService } from '../infra/prisma.service';
import { RabbitMqService } from '../infra/rabbitmq.service';

/** GET :WORKER_HEALTH_PORT/health — used by the Docker healthcheck. Owner: M10. */
@Injectable()
export class HealthServer implements OnApplicationBootstrap, OnModuleDestroy {
  private server?: Server;

  constructor(
    @InjectConfig() private readonly config: WorkerEnv,
    private readonly prisma: PrismaService,
    private readonly rabbit: RabbitMqService,
  ) {}

  onApplicationBootstrap() {
    this.server = createServer(async (_req, res) => {
      const db = await this.prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false);
      const checks = { db, rabbitmq: this.rabbit.isConnected() };
      const ok = checks.db && checks.rabbitmq;
      res.writeHead(ok ? 200 : 503, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ status: ok ? 'ok' : 'degraded', checks }));
    }).listen(this.config.WORKER_HEALTH_PORT, '0.0.0.0');
  }

  onModuleDestroy() {
    this.server?.close();
  }
}
