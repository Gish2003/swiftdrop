import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from '../../../common/pagination/pagination';

export class CreateAssignmentDto {
  @ApiProperty() @IsString() parcelId: string;
  @ApiProperty() @IsString() courierId: string;
}

export class ListUnassignedQuery extends PaginationQuery {
  @ApiPropertyOptional() @IsOptional() @IsString() zoneId?: string;
}

export class CourierWorkloadDto {
  @ApiProperty() courierId: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional({ nullable: true }) zoneId: string | null;
  @ApiProperty() isAvailable: boolean;
  @ApiProperty() activeParcels: number;
  @ApiProperty() maxActiveParcels: number;
}

export class AssignmentDto {
  @ApiProperty() id: string;
  @ApiProperty() parcelId: string;
  @ApiProperty() courierId: string;
  @ApiProperty() status: string;
  @ApiProperty() assignedAt: Date;
}
