import { Module } from '@nestjs/common';
import { EventOpsController } from './event-ops.controller';

@Module({ controllers: [EventOpsController] })
export class EventOpsModule {}
