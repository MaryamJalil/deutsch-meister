import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Progress } from 'src/models/progress.model';
import { ProgressService } from './progress.service';
import type { JwtPayload } from 'src/auth/jwt-payload.interface';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Resolver(() => Progress)
export class ProgressResolver {
  constructor(private readonly progressService: ProgressService) {}

  @Mutation(() => Progress)
  @UseGuards(GqlAuthGuard)
  async updateUserProgress(
    @CurrentUser() user: JwtPayload,
    @Args('xp', { type: () => Int }) xp: number,
    @Args('streak', { type: () => Int }) streak: number,
    @Args('lessons', { type: () => Int }) lessons: number,
  ): Promise<any> {
    console.log(user,'bhoijjoj')
    const userId = user.sub;

    return this.progressService.updateUserProgress(userId, {
      xp,
      streak,
      lessonsDone: lessons,
    });
  }
}