# M06: Courier application

> **Kick-off prompt for your agent**
> "I am M6 on SwiftDrop. Read AGENTS.md, then docs/members/M06-courier-app.md, docs/contracts/parcel-lifecycle.md,
> ADR-0005 and docs/conventions/security.md (uploads). Implement my Week-N tasks only inside my owned paths.
> Find stubs with `grep -rn "TODO(M6)\|notImplemented('M6')" apps`. Write unit + integration tests including
> cross-courier negative cases, then run `make check`."

## Mission

A **mobile-friendly** courier workflow: sign in → see assigned deliveries → update permitted statuses
→ capture **proof of delivery** (recipient name + photo) or a **failure reason** → view history.

## You own

- API: `apps/api/src/modules/courier/` (CourierService, CourierController, ProofViewController), `apps/api/src/infra/storage/` (StorageService), `apps/api/test/courier/`
- `packages/db/prisma/schema/courier.prisma` (ProofOfDelivery)
- Web: `src/app/courier/**`, `src/features/courier/`

## Interfaces you consume

| From | Interface                                                                                 |
| ---- | ----------------------------------------------------------------------------------------- |
| M7   | `DispatchService.getActiveAssignment(parcelId, tx?)`, `completeAssignment(parcelId, tx?)` |
| M4   | `ParcelsService.transition(parcelId, { to, actor, failureReason?, note?, tx })`           |
| M1   | `StorageService.put/get/remove` (you own it from now on)                                  |

## Endpoints (stubs exist)

**Authorization pattern for every courier endpoint:** load the ACTIVE assignment for the parcel. If
it's missing or `assignment.courierId !== user.id`, return **404**.

| Endpoint                            | Behaviour                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /courier/parcels`              | Parcels with an ACTIVE assignment to me. Show the fields a courier needs: addresses, recipient name and phone, size, status.                                                                                                                                                                                                                                                                                                          |
| `GET /courier/parcels/:id`          | One assigned parcel plus history                                                                                                                                                                                                                                                                                                                                                                                                      |
| `PATCH /courier/parcels/:id/status` | `CourierStatusUpdateDto` (`PICKED_UP`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `FAILED` + `failureReason`). Delegate to `transition`. M4 enforces the graph.                                                                                                                                                                                                                                                                                |
| `POST /courier/parcels/:id/proof`   | multipart with `photo` + `recipientName` + `notes?`. Check size ≤ `UPLOAD_MAX_BYTES` and **magic bytes** (jpeg/png/webp, not the client's mimetype). Object key `pod/<parcelId>/<uuid>.<ext>`. Then, in **one transaction**: create `ProofOfDelivery` + `transition(DELIVERED, tx)` + `completeAssignment(tx)`. If the transaction fails, delete the uploaded object. Errors: `UNSUPPORTED_FILE`, `FILE_TOO_LARGE`, `PROOF_REQUIRED`. |
| `GET /courier/history`              | My completed (DELIVERED or FAILED) assignments, paginated                                                                                                                                                                                                                                                                                                                                                                             |
| `GET /parcels/:id/proof/photo`      | Stream the photo. Allowed for: the courier who captured it, DISPATCHER/ADMIN, and the owning customer. Everyone else gets 404. Set `Cache-Control: private, no-store`.                                                                                                                                                                                                                                                                |

The multer limit in the controller is 5 MB. Keep it consistent with `UPLOAD_MAX_BYTES`, and
consider moving the check into a reusable pipe.

## Web (mobile first: test at 375 px width)

- `/courier`: card list of assigned deliveries with big tap targets, status badges and the next-action button.
- `/courier/parcels/[id]`:
  - details, with phone as a `tel:` link and address as a maps link;
  - the action buttons for the allowed next status;
  - a **Failed** dialog with a reason select (`FAILURE_REASONS`) and a note;
  - a **Deliver** form with recipient name and a photo input `accept="image/*" capture="environment"`;
  - upload progress and errors.
- `/courier/history`: past deliveries.

## Tests required

- Unit: magic-byte detection; which status buttons appear for each status (pure function).
- Integration (`test/courier/`):
  - **courier2 cannot see or update courier1's parcel (404)**;
  - an unassigned parcel → 404;
  - a valid status update creates a history row;
  - FAILED without a reason → 422;
  - proof upload with a PNG → DELIVERED + ProofOfDelivery + assignment COMPLETED;
  - a text file renamed `.jpg` → 400 `UNSUPPORTED_FILE`;
  - more than 5 MB → rejected;
  - a customer can view the photo of their own delivered parcel; another customer gets 404.
- E2E with M10 (mobile project, tag `@mobile`): courier marks a parcel delivered with a photo.

## Week-by-week

| Week | Tasks                                                                                  | Exit                                      |
| ---- | -------------------------------------------------------------------------------------- | ----------------------------------------- |
| 1    | Confirm the storage approach (RustFS/S3, ADR-0005) and the assignment contract with M7 | Agreed                                    |
| 3    | Assigned list + status updates (API + UI)                                              | **Booking → assignment → courier update** |
| 4    | Proof of delivery upload + failure reasons                                             | Courier completes a delivery with a photo |
| 5    | Proof photo viewing for customer and dispatcher; history                               | —                                         |
| 6    | Mobile polish, error states                                                            | —                                         |
| 7    | Negative tests, upload validation tests, E2E mobile spec                               | Green                                     |
| 8    | Demo step 4, docs                                                                      | —                                         |

## Status / notes

_Update as you go._
