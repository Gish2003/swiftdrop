import { Injectable } from '@nestjs/common';
import type { Readable } from 'node:stream';
import type { AuthUser } from '../../common/auth';
import { notImplemented } from '../../common/errors/app-error';
import { PrismaService } from '../../infra/prisma';
import { StorageService } from '../../infra/storage';
import { DispatchService } from '../dispatch';
import { ParcelsService } from '../parcels';
import type { CourierStatusUpdateDto, ProofOfDeliveryDto } from './dto/courier.dto';

/**
 * Courier workflow. EVERY action first checks DispatchService.getActiveAssignment(parcelId)
 * belongs to `user.id` (else 404). Status changes go through ParcelsService.transition. Owner: M6.
 */
@Injectable()
export class CourierService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly parcels: ParcelsService,
    private readonly dispatch: DispatchService,
    private readonly storage: StorageService,
  ) {}

  async listAssigned(_user: AuthUser) {
    notImplemented('M6');
  }

  async getAssigned(_user: AuthUser, _parcelId: string) {
    notImplemented('M6');
  }

  async updateStatus(_user: AuthUser, _parcelId: string, _dto: CourierStatusUpdateDto) {
    notImplemented('M6');
  }

  /** Validate file (magic bytes, size) → storage.put → ProofOfDelivery + transition DELIVERED + complete assignment, one tx. */
  async submitProof(
    _user: AuthUser,
    _parcelId: string,
    _dto: ProofOfDeliveryDto,
    _photo?: Express.Multer.File,
  ) {
    notImplemented('M6');
  }

  /** Stream the proof photo after authorization (courier who captured it, dispatcher/admin, or owning customer). */
  async proofPhoto(
    _user: AuthUser,
    _parcelId: string,
  ): Promise<{ stream: Readable; contentType: string }> {
    notImplemented('M6');
  }

  async history(_user: AuthUser) {
    notImplemented('M6');
  }
}
