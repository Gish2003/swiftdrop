# ER diagram

Source of truth: `packages/db/prisma/schema/*.prisma`. Keep this in sync when you add tables (owner of the table).

```mermaid
erDiagram
  User ||--o{ RefreshSession : has
  User ||--o{ OAuthAccount : links
  User ||--o| Merchant : owns
  User ||--o| CourierProfile : "is courier"
  User ||--o{ Parcel : "books (customer)"
  User ||--o{ CourierAssignment : "assigned (courier)"
  User ||--o{ CourierAssignment : "assigns (dispatcher)"
  User ||--o{ ParcelStatusHistory : acts
  User ||--o{ AuditLog : acts
  Merchant ||--o{ ApiKey : has
  Merchant ||--o{ WebhookEndpoint : has
  Merchant ||--o{ Parcel : creates
  WebhookEndpoint ||--o{ WebhookAttempt : records
  Parcel ||--o{ ParcelStatusHistory : has
  Parcel ||--o{ CourierAssignment : has
  Parcel ||--o| ProofOfDelivery : has
  DeliveryZone ||--o{ Parcel : "pickup/dropoff"
  DeliveryZone ||--o{ PricingRule : "from/to"
  DeliveryZone ||--o{ CourierProfile : serves

  User { string id PK; string email UK; string passwordHash; Role role; bool isActive }
  Merchant { string id PK; string ownerUserId UK; string businessName; MerchantStatus status }
  ApiKey { string id PK; string prefix UK; string keyHash UK; datetime revokedAt }
  WebhookEndpoint { string id PK; string url; string secretEncrypted; bool isActive }
  Parcel { string id PK; string trackingNumber UK; ParcelStatus status; int feeCents; string customerId FK; string merchantId FK }
  ParcelStatusHistory { string id PK; string parcelId FK; ParcelStatus fromStatus; ParcelStatus toStatus; string actorRole }
  CourierAssignment { string id PK; string parcelId FK; string courierId FK; AssignmentStatus status }
  CourierProfile { string id PK; string userId UK; string zoneId FK; bool isAvailable; int maxActiveParcels }
  ProofOfDelivery { string id PK; string parcelId UK; string recipientName; string photoKey }
  DeliveryZone { string id PK; string code UK; string[] cities }
  PricingRule { string id PK; int baseFeeCents; int perKgCents; int priority }
  AuditLog { string id PK; string action; string entityType; string entityId }
  OutboxEvent { string id PK; string eventType; json payload; datetime publishedAt }
  ProcessedEvent { string consumer PK; string eventId PK }
  WebhookAttempt { string id PK; string eventId; int attemptNumber; WebhookAttemptStatus status }
  NotificationLog { string id PK; string eventId; NotificationChannel channel; string status }
```
