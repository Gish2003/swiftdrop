import { Module } from '@nestjs/common';
import { PricingModule } from '../pricing';
import { ParcelsService } from './parcels.service';
import { TrackingStreamService } from './tracking-stream.service';
import { TrackingController } from './tracking.controller';

@Module({
  imports: [PricingModule],
  controllers: [TrackingController],
  providers: [ParcelsService, TrackingStreamService],
  exports: [ParcelsService],
})
export class ParcelsModule {}
