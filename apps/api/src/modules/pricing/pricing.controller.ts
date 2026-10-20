import { Body, Controller, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public, Roles } from '../../common/auth';
import {
  CreatePricingRuleDto,
  CreateZoneDto,
  EstimateRequestDto,
  EstimateResponseDto,
  PricingRuleDto,
  UpdatePricingRuleDto,
  UpdateZoneDto,
  ZoneDto,
} from './dto/pricing.dto';
import { PricingService } from './pricing.service';

/** Owner: M7 */
@ApiTags('pricing')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricing: PricingService) {}

  @Post('estimate')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Estimate a delivery fee (public)' })
  @ApiOkResponse({ type: EstimateResponseDto })
  estimate(@Body() dto: EstimateRequestDto) {
    return this.pricing.estimate(dto);
  }
}

/** Owner: M7 — zones & pricing administration (audit every change via AuditService). */
@ApiTags('admin')
@Controller('admin')
@Roles('ADMIN', 'DISPATCHER')
export class PricingAdminController {
  constructor(private readonly pricing: PricingService) {}

  @Get('zones')
  @ApiOkResponse({ type: [ZoneDto] })
  listZones() {
    return this.pricing.listZones();
  }

  @Post('zones')
  @ApiOkResponse({ type: ZoneDto })
  createZone(@Body() dto: CreateZoneDto) {
    return this.pricing.createZone(dto);
  }

  @Patch('zones/:id')
  @ApiOkResponse({ type: ZoneDto })
  updateZone(@Param('id') id: string, @Body() dto: UpdateZoneDto) {
    return this.pricing.updateZone(id, dto);
  }

  @Get('pricing-rules')
  @ApiOkResponse({ type: [PricingRuleDto] })
  listRules() {
    return this.pricing.listRules();
  }

  @Post('pricing-rules')
  @ApiOkResponse({ type: PricingRuleDto })
  createRule(@Body() dto: CreatePricingRuleDto) {
    return this.pricing.createRule(dto);
  }

  @Patch('pricing-rules/:id')
  @ApiOkResponse({ type: PricingRuleDto })
  updateRule(@Param('id') id: string, @Body() dto: UpdatePricingRuleDto) {
    return this.pricing.updateRule(id, dto);
  }
}
