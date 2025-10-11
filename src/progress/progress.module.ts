import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressService } from './progress.service';
import { ProgressResolver } from './progress.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule,AuthModule],
  providers: [ProgressService, ProgressResolver, PrismaService],
  exports: [ProgressService],
})
export class ProgressModule {}
