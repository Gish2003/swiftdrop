import { Injectable } from '@nestjs/common';
import type { FailureReason, ParcelStatus, Role } from '@swiftdrop/contracts';
import type { Parcel, Prisma } from '@swiftdrop/db';
import type { AuthUser } from '../../common/auth';
import { notImplemented } from '../../common/errors/app-error';
import { OutboxService } from '../../infra/events';
import { PrismaService } from '../../infra/prisma';
import { PricingService } from '../pricing';
import type { ParcelDetailsDto, PublicTrackingDto } from './dto/parcel.dto';

export interface CreateParcelInput extends ParcelDetailsDto {
  source: 'CUSTOMER' | 'MERCHANT_API';
  customerId?: string;
  merchantId?: string;
  merchantReference?: string;
}

export interface TransitionInput {
  to: ParcelStatus;
  actor: Pick<AuthUser, 'id' | 'role'> | { id: null; role: 'SYSTEM' };
  failureReason?: FailureReason;
  note?: string;
  /** Run inside a caller's transaction (e.g. courier proof upload + DELIVERED in one tx). */
  tx?: Prisma.TransactionClient;
}

/**
 * PUBLIC SERVICE — the ONLY place that creates parcels or changes their status (ADR-0001).
 * Every status change: validate graph (contracts.canTransition) → update parcel → insert
 * ParcelStatusHistory → OutboxService.enqueue('parcel.status_changed') — all in ONE transaction.
 * Callers (bookings M3, merchant-api M5, courier M6, dispatch M7) do their own authorization
 * BEFORE calling. Owner: M4.
 */
@Injectable()
export class ParcelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outbox: OutboxService,
    private readonly pricing: PricingService,
  ) {}

  /** Computes the fee via PricingService, generates a unique tracking number, writes CREATED history + parcel.created event. */
  async create(_input: CreateParcelInput, _actorRole: Role): Promise<Parcel> {
    notImplemented('M4');
  }

  /** Throws INVALID_STATUS_TRANSITION / FAILURE_REASON_REQUIRED / MAX_ATTEMPTS_REACHED. */
  async transition(_parcelId: string, _input: TransitionInput): Promise<Parcel> {
    notImplemented('M4');
  }

  findById(id: string): Promise<Parcel | null> {
    return this.prisma.parcel.findUnique({ where: { id } });
  }

  findByTrackingNumber(trackingNumber: string): Promise<Parcel | null> {
    return this.prisma.parcel.findUnique({ where: { trackingNumber } });
  }

  async getHistory(_parcelId: string) {
    notImplemented('M4');
  }

  /** Public tracking projection — privacy-safe (see PublicTrackingDto). */
  async getPublicTracking(_trackingNumber: string): Promise<PublicTrackingDto> {
    notImplemented('M4');
  }
}
