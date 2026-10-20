// Runs before each integration test file. Points the app at the TEST database.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgresql://swiftdrop:swiftdrop@localhost:5432/swiftdrop_test';
process.env.ENABLE_DEV_LOGIN = 'true';
process.env.LOG_LEVEL = 'warn';
