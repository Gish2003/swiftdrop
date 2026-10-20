import { Module } from '@nestjs/common';
import { PricingAdminController, PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';

@Module({
  controllers: [PricingController, PricingAdminController],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
