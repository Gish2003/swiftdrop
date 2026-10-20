import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles, type AuthUser } from '../../common/auth';
import { CourierService } from './courier.service';
import { CourierStatusUpdateDto, ProofOfDeliveryDto } from './dto/courier.dto';

/** Owner: M6 */
@ApiTags('courier')
@Controller('courier')
@Roles('COURIER')
export class CourierController {
  constructor(private readonly courier: CourierService) {}

  @Get('parcels')
  @ApiOperation({ summary: 'My active assigned deliveries' })
  list(@CurrentUser() user: AuthUser) {
    return this.courier.listAssigned(user);
  }

  @Get('parcels/:id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.courier.getAssigned(user, id);
  }

  @Patch('parcels/:id/status')
  updateStatus(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CourierStatusUpdateDto,
  ) {
    return this.courier.updateStatus(user, id, dto);
  }

  @Post('parcels/:id/proof')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Submit proof of delivery (marks DELIVERED)' })
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: 5 * 1024 * 1024 } }))
  proof(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ProofOfDeliveryDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.courier.submitProof(user, id, dto, photo);
  }

  @Get('history')
  history(@CurrentUser() user: AuthUser) {
    return this.courier.history(user);
  }
}

/** Owner: M6 — proof photo viewing for any authorized role (object-level check in service). */
@ApiTags('courier')
@Controller('parcels/:id/proof')
@Roles('COURIER', 'DISPATCHER', 'ADMIN', 'CUSTOMER')
export class ProofViewController {
  constructor(private readonly courier: CourierService) {}

  @Get('photo')
  async photo(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const { stream, contentType } = await this.courier.proofPhoto(user, id);
    return new StreamableFile(stream, { type: contentType });
  }
}
