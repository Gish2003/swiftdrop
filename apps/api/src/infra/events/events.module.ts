import { Global, Module } from '@nestjs/common';
import { OutboxService } from './outbox.service';
import { RabbitMqService } from './rabbitmq.service';

@Global()
@Module({ providers: [OutboxService, RabbitMqService], exports: [OutboxService, RabbitMqService] })
export class EventsModule {}
