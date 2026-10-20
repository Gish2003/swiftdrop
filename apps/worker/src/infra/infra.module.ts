import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RabbitMqService } from './rabbitmq.service';

@Global()
@Module({ providers: [PrismaService, RabbitMqService], exports: [PrismaService, RabbitMqService] })
export class InfraModule {}
