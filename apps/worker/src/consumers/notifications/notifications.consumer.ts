import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { QUEUES } from '@swiftdrop/contracts';
import { PrismaService } from '../../infra/prisma.service';
import { RabbitMqService } from '../../infra/rabbitmq.service';
import { MailProvider } from './mail.provider';

export const NOTIFICATIONS_CONSUMER = 'notifications';

/**
 * Consumes parcel events → emails/SMS the customer/recipient. Owner: M8.
 * Steps (TODO(M8)):
 *  1. domainEvent.safeParse(payload) — invalid → throw (dead-letter)
 *  2. markProcessed(prisma, NOTIFICATIONS_CONSUMER, eventId) — duplicate → return (ack)
 *  3. load parcel (+ customer) by data.parcelId — contact details come from the DB, not the event
 *  4. render template per newStatus, send via MailProvider, write NotificationLog (masked recipient)
 */
@Injectable()
export class NotificationsConsumer implements OnApplicationBootstrap {
  private readonly logger = new Logger(NotificationsConsumer.name);

  constructor(
    private readonly rabbit: RabbitMqService,
    private readonly prisma: PrismaService,
    private readonly mail: MailProvider,
  ) {}

  async onApplicationBootstrap() {
    await this.rabbit.consume(QUEUES.NOTIFICATIONS, (payload) => this.handle(payload));
  }

  async handle(payload: unknown): Promise<void> {
    void this.prisma;
    void this.mail;
    this.logger.debug(
      `received ${(payload as { eventType?: string }).eventType} (not implemented yet)`,
    );
  }
}
