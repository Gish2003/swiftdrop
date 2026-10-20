import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/auth';
import {
  CourierPerformanceDto,
  DailyVolumeDto,
  DeliverySummaryDto,
  ReportRangeQuery,
} from './dto/report.dto';
import { ReportsService } from './reports.service';

/** Owner: M9 */
@ApiTags('reports')
@Controller('admin/reports')
@Roles('ADMIN', 'DISPATCHER')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get('deliveries')
  @ApiOkResponse({ type: DeliverySummaryDto })
  deliveries(@Query() q: ReportRangeQuery) {
    return this.reports.deliverySummary(q);
  }

  @Get('daily-volume')
  @ApiOkResponse({ type: [DailyVolumeDto] })
  daily(@Query() q: ReportRangeQuery) {
    return this.reports.dailyVolume(q);
  }

  @Get('couriers')
  @ApiOkResponse({ type: [CourierPerformanceDto] })
  couriers(@Query() q: ReportRangeQuery) {
    return this.reports.courierPerformance(q);
  }
}
