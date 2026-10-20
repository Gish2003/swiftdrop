/** Worker root module — all consumers pre-registered. Owner: M8 (health: M10). */
import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MailProvider } from './consumers/notifications/mail.provider';
import { NotificationsConsumer } from './consumers/notifications/notifications.consumer';
import { WebhooksConsumer } from './consumers/webhooks/webhooks.consumer';
import { HealthServer } from './health/health.server';
import { InfraModule } from './infra/infra.module';
import { OutboxRelayService } from './outbox-relay/outbox-relay.service';

@Module({
  imports: [ConfigModule, InfraModule],
  providers: [
    OutboxRelayService,
    MailProvider,
    NotificationsConsumer,
    WebhooksConsumer,
    HealthServer,
  ],
})
export class WorkerModule {}
