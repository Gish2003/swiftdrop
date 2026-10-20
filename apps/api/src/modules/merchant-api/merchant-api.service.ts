import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../common/errors/app-error';
import { PaginationQuery } from '../../common/pagination/pagination';
import { PrismaService } from '../../infra/prisma';
import { ParcelsService } from '../parcels';
import type { MerchantCreateParcelDto } from './dto/merchant-api.dto';

/** Partner API — every query scoped by the merchantId resolved from the API key. Owner: M5. */
@Injectable()
export class MerchantApiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly parcels: ParcelsService,
  ) {}

  async createParcel(_merchantId: string, _dto: MerchantCreateParcelDto) {
    notImplemented('M5');
  }
  async listParcels(_merchantId: string, _q: PaginationQuery) {
    notImplemented('M5');
  }
  async getParcel(_merchantId: string, _trackingNumber: string) {
    notImplemented('M5');
  }
}
