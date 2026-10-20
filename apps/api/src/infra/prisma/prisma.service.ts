import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, PrismaPg } from '@swiftdrop/db';
import { InjectConfig, type Env } from '../../config/config.module';

/**
 * The one PrismaClient for the API. Inject it anywhere: `constructor(private readonly prisma: PrismaService)`.
 * Use `this.prisma.$transaction(async (tx) => { ... })` for multi-row changes (e.g. status + history + outbox).
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(@InjectConfig() config: Env) {
    super({ adapter: new PrismaPg({ connectionString: config.DATABASE_URL }) });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
