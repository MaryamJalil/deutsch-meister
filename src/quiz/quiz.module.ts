import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { QuizService } from './quiz.service';
import { QuizResolver } from './quiz.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [QuizService, QuizResolver, PrismaService],
  exports: [QuizService],
})
export class QuizModule {}
