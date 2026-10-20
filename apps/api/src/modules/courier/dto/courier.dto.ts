import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FAILURE_REASONS, type FailureReason } from '@swiftdrop/contracts';
import { IsIn, IsOptional, IsString, Length, MaxLength } from 'class-validator';

/** Couriers may only request these statuses; the graph itself is validated by ParcelsService. */
export const COURIER_SETTABLE = ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'FAILED'] as const;

export class CourierStatusUpdateDto {
  @ApiProperty({ enum: COURIER_SETTABLE, description: 'DELIVERED is set via POST /proof' })
  @IsIn(COURIER_SETTABLE)
  status: (typeof COURIER_SETTABLE)[number];

  @ApiPropertyOptional({ enum: FAILURE_REASONS, description: 'required when status=FAILED' })
  @IsOptional()
  @IsIn(FAILURE_REASONS)
  failureReason?: FailureReason;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) note?: string;
}

/** multipart/form-data: fields below + `photo` file (jpeg/png/webp, ≤ UPLOAD_MAX_BYTES). */
export class ProofOfDeliveryDto {
  @ApiProperty() @IsString() @Length(2, 100) recipientName: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) notes?: string;
}
