import { Module } from '@nestjs/common';
import { UsersModule } from '../users';
import { MerchantsAdminController, MerchantsController } from './merchants.controller';
import { MerchantsService } from './merchants.service';

@Module({
  imports: [UsersModule],
  controllers: [MerchantsController, MerchantsAdminController],
  providers: [MerchantsService],
  exports: [MerchantsService],
})
export class MerchantsModule {}
