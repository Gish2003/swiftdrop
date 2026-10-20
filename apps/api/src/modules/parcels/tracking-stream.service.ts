import { Injectable, OnModuleInit } from '@nestjs/common';
import type { TrackingSseMessage } from '@swiftdrop/contracts';
import { Observable, Subject } from 'rxjs';
import { RabbitMqService } from '../../infra/events';

/**
 * SSE fan-out (ADR-0004): each API instance binds its own exclusive queue `api.sse.<instanceId>`
 * to `parcel.status_changed.*` and pushes privacy-safe updates to connected browsers.
 * Owner: M4.
 */
@Injectable()
export class TrackingStreamService implements OnModuleInit {
  private readonly updates = new Subject<TrackingSseMessage>();

  constructor(private readonly rabbit: RabbitMqService) {}

  async onModuleInit() {
    // TODO(M4): this.rabbit.subscribeExclusive(`${QUEUES.SSE_PREFIX}${randomUUID()}`, ['parcel.status_changed.*'],
    //   (payload) => { validate with parcelStatusChangedV1, map to TrackingSseMessage, this.updates.next(...) });
    void this.rabbit;
  }

  /** Stream of updates for one tracking number. */
  streamFor(_trackingNumber: string): Observable<TrackingSseMessage> {
    // TODO(M4): this.updates.pipe(filter((m) => m.trackingNumber === trackingNumber))
    return this.updates.asObservable();
  }
}
