import { Controller, Get, MessageEvent, Param, Sse } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { map, type Observable } from 'rxjs';
import { Public } from '../../common/auth';
import { PublicTrackingDto } from './dto/parcel.dto';
import { ParcelsService } from './parcels.service';
import { TrackingStreamService } from './tracking-stream.service';

/** Owner: M4. Public, rate-limited, privacy-safe. */
@ApiTags('tracking')
@Controller('tracking')
@Public()
@Throttle({ default: { limit: 60, ttl: 60_000 } })
export class TrackingController {
  constructor(
    private readonly parcels: ParcelsService,
    private readonly stream: TrackingStreamService,
  ) {}

  @Get(':trackingNumber')
  @ApiOperation({ summary: 'Public tracking lookup' })
  @ApiOkResponse({ type: PublicTrackingDto })
  get(@Param('trackingNumber') trackingNumber: string) {
    return this.parcels.getPublicTracking(trackingNumber);
  }

  @Sse(':trackingNumber/events')
  @ApiOperation({ summary: 'Server-Sent Events stream of status changes (text/event-stream)' })
  events(@Param('trackingNumber') trackingNumber: string): Observable<MessageEvent> {
    // TODO(M4): verify tracking number exists first; send heartbeat comments every ~25s
    return this.stream
      .streamFor(trackingNumber)
      .pipe(map((data) => ({ type: 'status', data }) as MessageEvent));
  }
}
