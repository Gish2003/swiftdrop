import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class ReportRangeQuery {
  @ApiPropertyOptional({ example: '2026-11-01' }) @IsOptional() @IsISO8601() from?: string;
  @ApiPropertyOptional({ example: '2026-11-30' }) @IsOptional() @IsISO8601() to?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() zoneId?: string;
}

export class DeliverySummaryDto {
  @ApiProperty() total: number;
  @ApiProperty() delivered: number;
  @ApiProperty() failed: number;
  @ApiProperty() inProgress: number;
  @ApiProperty({ example: 0.93 }) successRate: number;
}

export class DailyVolumeDto {
  @ApiProperty({ example: '2026-11-03' }) date: string;
  @ApiProperty() created: number;
  @ApiProperty() delivered: number;
  @ApiProperty() failed: number;
}

export class CourierPerformanceDto {
  @ApiProperty() courierId: string;
  @ApiProperty() name: string;
  @ApiProperty() assigned: number;
  @ApiProperty() delivered: number;
  @ApiProperty() failed: number;
}
