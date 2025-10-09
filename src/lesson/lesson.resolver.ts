import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Lesson } from '../models';
import { LessonService } from './lesson.service';

@Resolver(() => Lesson)
export class LessonResolver {
  constructor(private readonly lessonService: LessonService) {}

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
}
