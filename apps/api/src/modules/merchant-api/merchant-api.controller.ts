import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { Public } from '../../common/auth';
import { PaginationQuery } from '../../common/pagination/pagination';
import { ParcelDto } from '../parcels';
import { ApiKeyGuard } from './api-key.guard';
import { MerchantCreateParcelDto } from './dto/merchant-api.dto';
import { MerchantApiService } from './merchant-api.service';

/** Owner: M5 — versioned partner API. @Public() skips JWT; ApiKeyGuard authenticates instead. */
@ApiTags('merchant-api')
@ApiSecurity('merchant-api-key')
@Controller('merchant')
@Public()
@UseGuards(ApiKeyGuard)
export class MerchantApiController {
  constructor(private readonly api: MerchantApiService) {}

  @Post('parcels')
  @ApiOperation({ summary: 'Create a parcel (idempotent on merchantReference)' })
  @ApiOkResponse({ type: ParcelDto })
  create(@Req() req: Request, @Body() dto: MerchantCreateParcelDto) {
    return this.api.createParcel(req.merchantId!, dto);
  }

  @Get('parcels')
  list(@Req() req: Request, @Query() q: PaginationQuery) {
    return this.api.listParcels(req.merchantId!, q);
  }

  @Get('parcels/:trackingNumber')
  @ApiOkResponse({ type: ParcelDto })
  get(@Req() req: Request, @Param('trackingNumber') trackingNumber: string) {
    return this.api.getParcel(req.merchantId!, trackingNumber);
  }
}
