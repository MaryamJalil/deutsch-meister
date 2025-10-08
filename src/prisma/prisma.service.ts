import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma, User } from '../../generated/prisma';
import { ConfigService } from '../config/config.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.databaseUrl,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Helper with strong typing for user creation
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.user.create({ data });
  }
}
