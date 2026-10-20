import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles, type AuthUser } from '../../common/auth';
import { DispatchService } from './dispatch.service';
import {
  AssignmentDto,
  CourierWorkloadDto,
  CreateAssignmentDto,
  ListUnassignedQuery,
} from './dto/dispatch.dto';

/** Owner: M7 */
@ApiTags('dispatch')
@Controller('dispatch')
@Roles('DISPATCHER', 'ADMIN')
export class DispatchController {
  constructor(private readonly dispatch: DispatchService) {}

  @Get('unassigned')
  unassigned(@Query() q: ListUnassignedQuery) {
    return this.dispatch.listUnassigned(q);
  }

  @Post('assignments')
  @ApiOkResponse({ type: AssignmentDto })
  assign(@CurrentUser() user: AuthUser, @Body() dto: CreateAssignmentDto) {
    return this.dispatch.assign(user, dto);
  }

  @Delete('assignments/:id')
  unassign(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.dispatch.unassign(user, id);
  }

  @Get('couriers/workload')
  @ApiOkResponse({ type: [CourierWorkloadDto] })
  workload() {
    return this.dispatch.courierWorkload();
  }
}
