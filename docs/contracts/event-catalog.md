# Event catalog

Owner: M8 (+ the producing module). Schemas: `packages/contracts/src/events.ts`.
Conventions: [../conventions/events.md](../conventions/events.md).

| eventType (v1)            | Routing key                  | Producer (when)                | Consumers                                                        |
| ------------------------- | ---------------------------- | ------------------------------ | ---------------------------------------------------------------- |
| `parcel.created`          | `parcel.created.v1`          | ParcelsService.create (M4)     | notifications (booking confirmation), webhooks (merchant orders) |
| `parcel.courier_assigned` | `parcel.courier_assigned.v1` | DispatchService.assign (M7)    | notifications (optional)                                         |
| `parcel.status_changed`   | `parcel.status_changed.v1`   | ParcelsService.transition (M4) | notifications, webhooks, API SSE fan-out                         |

## `parcel.status_changed` v1

```json
{
  "eventId": "6c0e2f9e-7a43-4b7e-9d0c-1f1d8a8a3b21",
  "eventType": "parcel.status_changed",
  "eventVersion": 1,
  "occurredAt": "2026-11-03T09:15:22.000Z",
  "correlationId": "41c62e55-52d4-4fee-a4fc-d61787f40cee",
  "data": {
    "parcelId": "cmvg…",
    "trackingNumber": "SD123456789",
    "merchantId": null,
    "customerId": "cmvg…",
    "previousStatus": "OUT_FOR_DELIVERY",
    "newStatus": "FAILED",
    "actorRole": "COURIER",
    "failureReason": "RECIPIENT_UNAVAILABLE"
  }
}
```

## `parcel.created` v1

`data: { parcelId, trackingNumber, merchantId | null, customerId | null }`

## `parcel.courier_assigned` v1

`data: { parcelId, trackingNumber, courierId, assignedById }`

## Changing an event

Additive optional fields are allowed: update the zod schema and this file in the same PR.
Anything else needs a new `eventVersion` (`…v2` routing key), and consumers must handle both
versions during the transition. Open a "contract change" issue first.
