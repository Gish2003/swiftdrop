import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { ParcelDetailsDto } from '../../parcels';

/** Partner order. `merchantReference` makes creation idempotent per merchant (retries return the same parcel). */
export class MerchantCreateParcelDto extends ParcelDetailsDto {
  @ApiProperty({ example: 'ORDER-10023' }) @IsString() @Length(1, 64) merchantReference: string;
}
