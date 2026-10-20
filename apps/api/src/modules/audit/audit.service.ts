import { Injectable } from '@nestjs/common';
import type { Prisma } from '@swiftdrop/db';
import type { AuthUser } from '../../common/auth';
import { notImplemented } from '../../common/errors/app-error';
import { PrismaService } from '../../infra/prisma';

export interface AuditEntry {
  actor: Pick<AuthUser, 'id' | 'role'> | null; // null = SYSTEM
  /** dot.case, e.g. "merchant.approved", "pricing_rule.updated", "user.role_changed" */
  action: string;
  entityType: string;
  entityId: string;
  /** Small, non-sensitive context (before/after ids or flags). NO secrets, NO addresses/phones. */
  metadata?: Prisma.InputJsonValue;
  ip?: string;
}

/**
 * PUBLIC SERVICE — every module calls `audit.record(...)` for sensitive admin actions.
 * Pass `tx` to write inside your own transaction. Owner: M9.
 * The basic insert works from day 1 so other members can integrate early.
 */
@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(entry: AuditEntry, tx?: Prisma.TransactionClient): Promise<void> {
    const db = tx ?? this.prisma;
    await db.auditLog.create({
      data: {
        actorId: entry.actor?.id ?? null,
        actorRole: entry.actor?.role ?? 'SYSTEM',
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        metadata: entry.metadata,
        ip: entry.ip,
      },
    });
  }

  async list(_q: unknown) {
    notImplemented('M9'); // TODO(M9): filters (actor, action, entity, date range) + pagination
  }
}
