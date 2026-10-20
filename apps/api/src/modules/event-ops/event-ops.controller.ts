import { Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { Roles } from '../../common/auth';
import { notImplemented } from '../../common/errors/app-error';
import { PaginationQuery } from '../../common/pagination/pagination';
import { PrismaService } from '../../infra/prisma';

const ATTEMPT_STATUSES = ['PENDING', 'SUCCEEDED', 'FAILED', 'DEAD'] as const;

export class ListAttemptsQuery extends PaginationQuery {
  @ApiPropertyOptional({ enum: ATTEMPT_STATUSES })
  @IsOptional()
  @IsIn(ATTEMPT_STATUSES)
  status?: string;
}

/** Owner: M8 — operator visibility into the event pipeline (outbox backlog, dead-lettered webhooks). */
@ApiTags('event-ops')
@Controller('admin/ops')
@Roles('ADMIN')
export class EventOpsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('outbox')
  async outbox() {
    const [pending, failing] = await Promise.all([
      this.prisma.outboxEvent.count({ where: { publishedAt: null } }),
      this.prisma.outboxEvent.count({ where: { publishedAt: null, attempts: { gt: 0 } } }),
    ]);
    return { pending, failing };
  }

  @Get('webhook-attempts')
  attempts(@Query() _q: ListAttemptsQuery) {
    notImplemented('M8');
  }

  @Post('webhook-attempts/:id/retry')
  @HttpCode(202)
  retry(@Param('id') _id: string) {
    notImplemented('M8'); // TODO(M8): re-queue a DEAD attempt
  }
}
