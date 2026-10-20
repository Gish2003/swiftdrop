import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../common/errors/app-error';
import { PrismaService } from '../../infra/prisma';
import type {
  CreatePricingRuleDto,
  CreateZoneDto,
  EstimateRequestDto,
  EstimateResponseDto,
  UpdatePricingRuleDto,
  UpdateZoneDto,
} from './dto/pricing.dto';

/**
 * PUBLIC SERVICE — source of truth for delivery fees (ParcelsService calls `estimate` when creating
 * a parcel, so the client can never set its own fee). Owner: M7.
 */
@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  /** Throws ZONE_NOT_SERVICED if either city is not in an active zone. */
  async estimate(_input: EstimateRequestDto): Promise<EstimateResponseDto> {
    notImplemented('M7'); // TODO(M7): resolve zones by city → pick most specific active rule → base + perKg*ceil(weight)
  }

  async listZones() {
    notImplemented('M7');
  }
  async createZone(_dto: CreateZoneDto) {
    notImplemented('M7');
  }
  async updateZone(_id: string, _dto: UpdateZoneDto) {
    notImplemented('M7');
  }
  async listRules() {
    notImplemented('M7');
  }
  async createRule(_dto: CreatePricingRuleDto) {
    notImplemented('M7');
  }
  async updateRule(_id: string, _dto: UpdatePricingRuleDto) {
    notImplemented('M7');
  }
}
