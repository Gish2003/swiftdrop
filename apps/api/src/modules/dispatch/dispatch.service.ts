import { Injectable } from '@nestjs/common';
import type { CourierAssignment, Prisma } from '@swiftdrop/db';
import type { AuthUser } from '../../common/auth';
import { notImplemented } from '../../common/errors/app-error';
import { PrismaService } from '../../infra/prisma';
import type { CreateAssignmentDto, ListUnassignedQuery } from './dto/dispatch.dto';

/**
 * PUBLIC SERVICE — courier assignment. M6 (courier) uses `getActiveAssignment` to authorize
 * courier actions. Owner: M7.
 */
@Injectable()
export class DispatchService {
  constructor(private readonly prisma: PrismaService) {}

  /** The ACTIVE assignment for a parcel, or null. */
  getActiveAssignment(
    parcelId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<CourierAssignment | null> {
    return (tx ?? this.prisma).courierAssignment.findFirst({
      where: { parcelId, status: 'ACTIVE' },
    });
  }

  /** Mark the active assignment COMPLETED (called when a parcel reaches DELIVERED). */
  async completeAssignment(_parcelId: string, _tx?: Prisma.TransactionClient): Promise<void> {
    notImplemented('M7');
  }

  async listUnassigned(_q: ListUnassignedQuery) {
    notImplemented('M7');
  }

  /** In ONE transaction: check parcel assignable + courier capacity → create assignment → audit → outbox parcel.courier_assigned. */
  async assign(_actor: AuthUser, _dto: CreateAssignmentDto) {
    notImplemented('M7');
  }

  async unassign(_actor: AuthUser, _assignmentId: string) {
    notImplemented('M7');
  }

  async courierWorkload() {
    notImplemented('M7');
  }
}
