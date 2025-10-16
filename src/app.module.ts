// src/app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import type { Request } from 'express';

import { AuthModule } from './auth';
import { UserModule } from './user';
import { LessonModule } from './lesson';
import { QuizModule } from './quiz';
import { ConfigModule } from './config/config.module';
import { ProgressModule } from './progress/progress.module';
import { AudioModule } from './audio/audio.module';

@Module({
  imports: [
    ConfigModule,
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: true,
  playground: true,
  context: ({ req }: { req: Request }) => ({ req }),
}),
    AuthModule,
    UserModule,
    LessonModule,
    QuizModule,
    ProgressModule,
    AudioModule
  ],
})
export class AppModule {}
