import { Injectable } from '@nestjs/common';
import type { Readable } from 'node:stream';
import type { AuthUser } from '../../common/auth';
import { notImplemented } from '../../common/errors/app-error';
import { PrismaService } from '../../infra/prisma';
import { ParcelsService, type ParcelDto } from '../parcels';
import type { CreateBookingDto, ListMyParcelsQuery } from './dto/booking.dto';

/**
 * Customer-facing booking flow. Delegates creation to ParcelsService (M4) and fees to
 * PricingService (M7). Every query MUST be scoped to `customerId = user.id`. Owner: M3.
 */
@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly parcels: ParcelsService,
  ) {}

  async create(_user: AuthUser, _dto: CreateBookingDto): Promise<ParcelDto> {
    notImplemented('M3'); // TODO(M3): this.parcels.create({ ...dto, source: 'CUSTOMER', customerId: user.id }, user.role)
  }

  async listMine(_user: AuthUser, _q: ListMyParcelsQuery) {
    notImplemented('M3');
  }

  /** 404 (not 403) when the parcel belongs to someone else — don't leak existence. */
  async getMine(_user: AuthUser, _id: string): Promise<ParcelDto> {
    notImplemented('M3');
  }

  /** PDF receipt via pdfkit. */
  async receiptPdf(_user: AuthUser, _id: string): Promise<{ filename: string; stream: Readable }> {
    notImplemented('M3');
  }
}
