import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../common/errors/app-error';
import { PrismaService } from '../../infra/prisma';
import type {
  CourierPerformanceDto,
  DailyVolumeDto,
  DeliverySummaryDto,
  ReportRangeQuery,
} from './dto/report.dto';

/** Read-only aggregate queries. Default range = last 30 days. No PII in report rows. Owner: M9. */
@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async deliverySummary(_q: ReportRangeQuery): Promise<DeliverySummaryDto> {
    notImplemented('M9');
  }
  async dailyVolume(_q: ReportRangeQuery): Promise<DailyVolumeDto[]> {
    notImplemented('M9');
  }
  async courierPerformance(_q: ReportRangeQuery): Promise<CourierPerformanceDto[]> {
    notImplemented('M9');
  }
}
