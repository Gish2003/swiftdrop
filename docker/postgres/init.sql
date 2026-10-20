-- Runs once on first start of the postgres volume. Creates the integration-test database.
CREATE DATABASE swiftdrop_test;
-- Scratch database used by `prisma migrate diff` (drift check).
CREATE DATABASE swiftdrop_shadow;
