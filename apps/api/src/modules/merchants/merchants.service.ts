import { Injectable } from '@nestjs/common';
import type { AuthUser } from '../../common/auth';
import { notImplemented } from '../../common/errors/app-error';
import { PrismaService } from '../../infra/prisma';
import { UsersService } from '../users';
import type {
  CreateApiKeyDto,
  CreateWebhookDto,
  ListMerchantsQuery,
  RegisterMerchantDto,
  UpdateWebhookDto,
} from './dto/merchant.dto';

/**
 * Merchant accounts, approval, API keys and webhook endpoints. Owner: M5.
 * Tenancy rule: the merchant is ALWAYS derived from the session (`ownerUserId = user.id`) or the
 * API key — never from a request body/param.
 */
@Injectable()
export class MerchantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}

  async register(_dto: RegisterMerchantDto) {
    notImplemented('M5'); // TODO(M5): users.createUser({ role: 'MERCHANT', ... }) + merchant PENDING in one tx
  }

  async getMine(_user: AuthUser) {
    notImplemented('M5');
  }

  /**
   * PUBLIC (used by merchant-api ApiKeyGuard). Parse `sd_live_<prefix>_<secret>`, look up by prefix,
   * constant-time compare SHA-256 hash, reject revoked keys / non-APPROVED merchants, touch lastUsedAt.
   * Returns the merchantId or null.
   */
  async verifyApiKey(_rawKey: string): Promise<string | null> {
    notImplemented('M5');
  }

  async listApiKeys(_user: AuthUser) {
    notImplemented('M5');
  }
  async createApiKey(_user: AuthUser, _dto: CreateApiKeyDto) {
    notImplemented('M5');
  }
  async revokeApiKey(_user: AuthUser, _id: string) {
    notImplemented('M5');
  }

  async listWebhooks(_user: AuthUser) {
    notImplemented('M5');
  }
  async createWebhook(_user: AuthUser, _dto: CreateWebhookDto) {
    notImplemented('M5'); // TODO(M5): generate secret, encrypt with WEBHOOK_SECRET_ENC_KEY (AES-256-GCM)
  }
  async updateWebhook(_user: AuthUser, _id: string, _dto: UpdateWebhookDto) {
    notImplemented('M5');
  }
  async deleteWebhook(_user: AuthUser, _id: string) {
    notImplemented('M5');
  }
  async rotateWebhookSecret(_user: AuthUser, _id: string) {
    notImplemented('M5');
  }
  async listWebhookAttempts(_user: AuthUser, _id: string) {
    notImplemented('M5');
  }

  // admin
  async adminList(_q: ListMerchantsQuery) {
    notImplemented('M5');
  }
  async approve(_admin: AuthUser, _id: string) {
    notImplemented('M5'); // TODO(M5): audit 'merchant.approved'
  }
  async reject(_admin: AuthUser, _id: string, _reason?: string) {
    notImplemented('M5');
  }
  async suspend(_admin: AuthUser, _id: string) {
    notImplemented('M5');
  }
}
