import { ApiPropertyOptional } from '@nestjs/swagger';
import { PARCEL_STATUSES, type ParcelStatus } from '@swiftdrop/contracts';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationQuery } from '../../../common/pagination/pagination';
import { ParcelDetailsDto } from '../../parcels';

/** Customer booking = the shared parcel details. Fee is computed server-side, never sent by the client. */
export class CreateBookingDto extends ParcelDetailsDto {}

export class ListMyParcelsQuery extends PaginationQuery {
  @ApiPropertyOptional({ enum: PARCEL_STATUSES })
  @IsOptional()
  @IsIn(PARCEL_STATUSES)
  status?: ParcelStatus;
}
