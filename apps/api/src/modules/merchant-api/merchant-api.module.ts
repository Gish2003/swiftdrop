import { Module } from '@nestjs/common';
import { MerchantsModule } from '../merchants';
import { ParcelsModule } from '../parcels';
import { ApiKeyGuard } from './api-key.guard';
import { MerchantApiController } from './merchant-api.controller';
import { MerchantApiService } from './merchant-api.service';

@Module({
  imports: [MerchantsModule, ParcelsModule],
  controllers: [MerchantApiController],
  providers: [MerchantApiService, ApiKeyGuard],
})
export class MerchantApiModule {}
