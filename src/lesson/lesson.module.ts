import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { LessonService } from './lesson.service';
import { LessonResolver } from './lesson.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressService } from 'src/progress/progress.service';

@Module({
  imports: [ConfigModule],
  providers: [LessonService, LessonResolver, PrismaService,ProgressService],
  exports: [LessonService],
})
export class LessonModule {}
