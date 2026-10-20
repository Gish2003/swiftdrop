// Owner: M2. Demo accounts — documented in README.md "Test accounts". Never use real people's data.
import * as argon2 from 'argon2';
import type { PrismaClient, Role } from '../src';

export const DEMO_PASSWORD = 'Password123!';

export const DEMO_USERS: { email: string; name: string; role: Role }[] = [
  { email: 'admin@swiftdrop.test', name: 'Ada Admin', role: 'ADMIN' },
  { email: 'dispatcher@swiftdrop.test', name: 'Dilan Dispatcher', role: 'DISPATCHER' },
  { email: 'courier1@swiftdrop.test', name: 'Chamal Courier', role: 'COURIER' },
  { email: 'courier2@swiftdrop.test', name: 'Kasun Courier', role: 'COURIER' },
  { email: 'customer@swiftdrop.test', name: 'Nimali Customer', role: 'CUSTOMER' },
  { email: 'customer2@swiftdrop.test', name: 'Ruwan Customer', role: 'CUSTOMER' },
  { email: 'merchant@swiftdrop.test', name: 'Mala Merchant', role: 'MERCHANT' },
];

export async function seedUsers(prisma: PrismaClient) {
  const passwordHash = await argon2.hash(DEMO_PASSWORD, { type: argon2.argon2id });
  for (const u of DEMO_USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash, phone: '+94770000000' },
    });
  }
}
