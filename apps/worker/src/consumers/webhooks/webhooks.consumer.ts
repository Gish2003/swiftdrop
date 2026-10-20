import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { QUEUES } from '@swiftdrop/contracts';
import { InjectConfig, type WorkerEnv } from '../../config/config.module';
import { PrismaService } from '../../infra/prisma.service';
import { RabbitMqService } from '../../infra/rabbitmq.service';

export const WEBHOOKS_CONSUMER = 'webhooks';

/**
 * Delivers parcel events to merchant webhook endpoints. Owner: M8 (endpoint config is M5's).
 * Steps (TODO(M8)):
 *  1. validate event; skip if data.merchantId is null; idempotency via markProcessed
 *  2. for each active WebhookEndpoint of the merchant subscribed to eventType:
 *     - body = JSON event; signature header per WEBHOOK_HEADERS (HMAC-SHA256 of `${t}.${body}`,
 *       secret decrypted with WEBHOOK_SECRET_ENC_KEY); fetch with AbortSignal.timeout(WEBHOOK_TIMEOUT_MS)
 *     - record WebhookAttempt (status, responseStatus, durationMs)
 *     - 2xx → SUCCEEDED; 408/429/5xx/network → retry with backoff (WEBHOOK_RETRY_DELAYS_MS);
 *       other 4xx → FAILED (no retry); retries exhausted → DEAD (dead-letter, visible in /admin/ops)
 */
@Injectable()
export class WebhooksConsumer implements OnApplicationBootstrap {
  private readonly logger = new Logger(WebhooksConsumer.name);

  constructor(
    @InjectConfig() private readonly config: WorkerEnv,
    private readonly rabbit: RabbitMqService,
    private readonly prisma: PrismaService,
  ) {}

  async onApplicationBootstrap() {
    await this.rabbit.consume(QUEUES.WEBHOOKS, (payload) => this.handle(payload));
  }

  async handle(payload: unknown): Promise<void> {
    void this.config;
    void this.prisma;
    this.logger.debug(
      `received ${(payload as { eventType?: string }).eventType} (not implemented yet)`,
    );
  }
}

/** Retry policy — pure function, unit-test it. TODO(M8): implement + spec. */
export function isRetryable(status: number | null): boolean {
  if (status === null) return true; // network error / timeout
  return status === 408 || status === 429 || status >= 500;
}
