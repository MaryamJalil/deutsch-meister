// progress.resolver.ts
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Progress } from 'src/models/progress.model';
import { ProgressService } from './progress.service';
import type { JwtPayload } from 'src/auth/jwt-payload.interface';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Resolver(() => Progress)
export class ProgressResolver {
  constructor(private readonly progressService: ProgressService) {}

  // progress.resolver.ts
@Mutation(() => Progress)
@UseGuards(GqlAuthGuard)
async updateUserProgress(
  @CurrentUser() user: JwtPayload,
  @Args('xp', { type: () => Int, nullable: true }) xp?: number,
  @Args('streak', { type: () => Int, nullable: true }) streak?: number,
  @Args('lessons', { type: () => Int, nullable: true }) lessons?: number,
  @Args('activityType', { type: () => String, nullable: true }) activityType?: 'LESSON' | 'QUIZ' | 'DAILY_GOAL',
  @Args('accuracy', { type: () => Int, nullable: true }) accuracy?: number,
  @Args('score', { type: () => Int, nullable: true }) score?: number,
): Promise<any> {
  const userId = user.sub;

  const activityData: any = {};
  if (accuracy !== undefined) activityData.accuracy = accuracy / 100;
  if (score !== undefined) activityData.score = score / 100;

  return this.progressService.updateUserProgress(userId, {
    xp,
    streak,
    lessonsDone: lessons,
    activityType,
    activityData: Object.keys(activityData).length > 0 ? activityData : undefined,
  });
}}