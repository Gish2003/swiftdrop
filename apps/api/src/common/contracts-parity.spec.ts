/** Guards against drift between the shared contracts and the Prisma enums. */
import { PARCEL_SIZES, PARCEL_STATUSES, ROLES } from '@swiftdrop/contracts';
import { ParcelSize, ParcelStatus, Role } from '@swiftdrop/db';

describe('contracts ↔ prisma enum parity', () => {
  it.each([
    ['Role', ROLES, Role],
    ['ParcelStatus', PARCEL_STATUSES, ParcelStatus],
    ['ParcelSize', PARCEL_SIZES, ParcelSize],
  ])('%s matches', (_name, contract, prismaEnum) => {
    expect([...contract].sort()).toEqual(Object.values(prismaEnum).sort());
  });
});
