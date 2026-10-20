import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EVENTS_EXCHANGE } from '@swiftdrop/contracts';
import * as amqp from 'amqp-connection-manager';
import type { ChannelWrapper } from 'amqp-connection-manager';
import type { Channel, ConsumeMessage } from 'amqplib';
import { InjectConfig, type WorkerEnv } from '../config/config.module';
import { assertTopology } from './topology';

export type MessageHandler = (payload: unknown, msg: ConsumeMessage) => Promise<void>;

/** Connection + confirm channel for publishing, and a helper to register consumers. Owner: M8. */
@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMqService.name);
  private connection!: amqp.AmqpConnectionManager;
  private publisher!: ChannelWrapper;

  constructor(@InjectConfig() private readonly config: WorkerEnv) {}

  onModuleInit() {
    this.connection = amqp.connect([this.config.RABBITMQ_URL]);
    this.connection.on('connect', () => this.logger.log('RabbitMQ connected'));
    this.connection.on('disconnect', ({ err }) =>
      this.logger.warn(`RabbitMQ disconnected: ${err?.message}`),
    );
    this.publisher = this.connection.createChannel({
      json: false,
      confirm: true,
      setup: assertTopology,
    });
  }

  isConnected() {
    return this.connection?.isConnected() ?? false;
  }

  /** Publish with broker confirm. Resolves only when RabbitMQ has accepted the message. */
  async publish(routingKey: string, body: unknown, headers: Record<string, string> = {}) {
    await this.publisher.publish(EVENTS_EXCHANGE, routingKey, Buffer.from(JSON.stringify(body)), {
      persistent: true,
      contentType: 'application/json',
      headers,
    });
  }

  /**
   * Consume a durable work queue. Handler success → ack. Handler throws → nack(requeue=false),
   * which dead-letters the message. TODO(M8): route transient failures to retry queues first.
   */
  async consume(queue: string, handler: MessageHandler, prefetch = 10) {
    const channel = this.connection.createChannel({
      setup: async (ch: Channel) => {
        await assertTopology(ch);
        await ch.prefetch(prefetch);
        await ch.consume(queue, async (msg) => {
          if (!msg) return;
          try {
            await handler(JSON.parse(msg.content.toString()), msg);
            ch.ack(msg);
          } catch (err) {
            this.logger.error(`[${queue}] handler failed: ${(err as Error).message}`);
            ch.nack(msg, false, false);
          }
        });
      },
    });
    await channel.waitForConnect();
  }

  async onModuleDestroy() {
    await this.connection?.close();
  }
}
