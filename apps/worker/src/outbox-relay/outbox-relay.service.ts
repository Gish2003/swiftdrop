import { Injectable, Logger, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { InjectConfig, type WorkerEnv } from '../config/config.module';
import { PrismaService } from '../infra/prisma.service';
import { RabbitMqService } from '../infra/rabbitmq.service';

/**
 * Transactional-outbox relay (ADR-0002). Polls `outbox_events` WHERE publishedAt IS NULL and
 * publishes each row to `swiftdrop.events` with its routingKey, then sets publishedAt.
 * Owner: M8.
 */
@Injectable()
export class OutboxRelayService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(OutboxRelayService.name);
  private timer?: NodeJS.Timeout;
  private running = false;

  constructor(
    @InjectConfig() private readonly config: WorkerEnv,
    private readonly prisma: PrismaService,
    private readonly rabbit: RabbitMqService,
  ) {}

  onApplicationBootstrap() {
    this.timer = setInterval(() => void this.tick(), this.config.OUTBOX_POLL_INTERVAL_MS);
  }

  onModuleDestroy() {
    clearInterval(this.timer);
  }

  private async tick() {
    if (this.running || !this.rabbit.isConnected()) return;
    this.running = true;
    try {
      const published = await this.relayOnce();
      if (published > 0) this.logger.debug(`published ${published} outbox event(s)`);
    } catch (err) {
      this.logger.error(`relay failed: ${(err as Error).message}`);
    } finally {
      this.running = false;
    }
  }

  /**
   * Publish one batch; returns how many rows were published.
   * TODO(M8):
   *  - select a batch ordered by createdAt (OUTBOX_BATCH_SIZE); lock with
   *    `SELECT ... FOR UPDATE SKIP LOCKED` (via $queryRaw in a tx) so several workers can run
   *  - this.rabbit.publish(row.routingKey, row.payload, { 'x-correlation-id': row.correlationId })
   *  - on success set publishedAt; on failure increment attempts + lastError (never lose the row)
   */
  async relayOnce(): Promise<number> {
    void this.prisma;
    return 0;
  }
}
