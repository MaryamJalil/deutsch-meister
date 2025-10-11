import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { Lesson } from '../models';
import { LessonService } from './lesson.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { ProgressService } from 'src/progress/progress.service';
import { Progress } from 'src/models/progress.model';
import { CurrentUser } from 'src/auth/current-user.decorator';
import  type { JwtPayload } from 'src/auth/jwt-payload.interface';


@Resolver(() => Lesson)
export class LessonResolver {
  constructor(
    private readonly lessonService: LessonService,
    private readonly progressService: ProgressService,
  ) {}

  @Query(() => [Lesson])
  async lessons(): Promise<Lesson[]> {
    return this.lessonService.findAll();
  }

  @Query(() => [Lesson])
  async lessonsByLevel(
    @Args('level', { type: () => String }) level: string,
  ): Promise<Lesson[]> {
    return this.lessonService.findByLevel(level);
  }

  @Query(() => Lesson, { nullable: true })
  async lesson(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Lesson | null> {
    return this.lessonService.findById(id);
  }

  @Mutation(() => Lesson)
  async createLesson(
    @Args('title', { type: () => String }) title: string,
    @Args('level', { type: () => String }) level: string,
    @Args('content', { type: () => String, nullable: true }) content?: string,
  ): Promise<Lesson> {
    return this.lessonService.create({ title, level, content });
  }

  @Mutation(() => Lesson)
  async updateLesson(
    @Args('id', { type: () => Int }) id: number,
    @Args('title', { type: () => String, nullable: true }) title?: string,
    @Args('level', { type: () => String, nullable: true }) level?: string,
    @Args('content', { type: () => String, nullable: true }) content?: string,
  ): Promise<Lesson> {
    const updateData: {
      title?: string;
      level?: string;
      content?: string;
    } = {};
    if (title !== undefined) updateData.title = title;
    if (level !== undefined) updateData.level = level;
    if (content !== undefined) updateData.content = content;

    return this.lessonService.update(id, updateData);
  }

  @Mutation(() => Lesson)
  async deleteLesson(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Lesson> {
    return this.lessonService.delete(id);
  }


  @Mutation(() => Progress)
  @UseGuards(GqlAuthGuard)
  async completeLesson(
    @CurrentUser() user: JwtPayload,
    @Args('lessonId', { type: () => Int }) lessonId: number,
  ): Promise<Progress> {
    console.log(user,'user1')
    const lesson = await this.lessonService.findById(lessonId);
    console.log(lesson,'lesson34')
    if (!lesson) {
      throw new Error(`Lesson with ID ${lessonId} not found`);
    }

    return await this.progressService.completeLesson(user.sub);
  }
}

