import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { LessonService } from './lesson.service';
import { LessonResolver } from './lesson.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [LessonService, LessonResolver, PrismaService],
  exports: [LessonService],
})
export class LessonModule {}
