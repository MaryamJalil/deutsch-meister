import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [UserService, UserResolver, PrismaService],
  exports: [UserService],
})
export class UserModule {}
