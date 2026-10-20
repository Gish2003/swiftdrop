import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_CODES, MERCHANT_API_KEY_HEADER } from '@swiftdrop/contracts';
import type { Request } from 'express';
import { AppError } from '../../common/errors/app-error';
import { MerchantsService } from '../merchants';

/** Authenticates partner calls by `X-Api-Key` and sets `req.merchantId`. Keys are NEVER accepted in URLs. Owner: M5. */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly merchants: MerchantsService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const raw = req.header(MERCHANT_API_KEY_HEADER);
    const merchantId = raw ? await this.merchants.verifyApiKey(raw) : null;
    if (!merchantId) {
      throw new AppError(
        ERROR_CODES.INVALID_API_KEY,
        'Missing or invalid API key',
        HttpStatus.UNAUTHORIZED,
      );
    }
    req.merchantId = merchantId;
    return true;
  }
}
