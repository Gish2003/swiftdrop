# ADR-0005: Private S3-compatible storage for proof of delivery

**Status:** accepted · **Owner:** M6

## Decision

- Store proof photos in a private bucket on an S3-compatible server. In dev this is RustFS (compose
  service `minio`; the MinIO community image is no longer published).
- The API uses the `minio` npm client through `StorageService`.
- The database stores only object keys (`pod/<parcelId>/<uuid>.<ext>`).
- Files are served by streaming through an authorized API endpoint. There are no public URLs.
- Uploads are checked for size (≤ `UPLOAD_MAX_BYTES`) and by magic bytes (jpeg/png/webp).

## Consequences

- Access control stays in one place: API authorization.
- The same code works against AWS S3 in a real deployment.
