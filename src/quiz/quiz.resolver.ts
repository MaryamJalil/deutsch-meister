import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Quiz } from '../models';
import { QuizService } from './quiz.service';

@Resolver(() => Quiz)
export class QuizResolver {
  constructor(private readonly quizService: QuizService) {}

  @Query(() => [Quiz])
  async quizzes(): Promise<Quiz[]> {
    return this.quizService.findAll();
  }

  @Query(() => [Quiz])
  async quizzesByLevel(
    @Args('level', { type: () => String }) level: string,
  ): Promise<Quiz[]> {
    return this.quizService.findByLevel(level);
  }

  @Query(() => [Quiz])
  async quizzesByLesson(
    @Args('lessonId', { type: () => Int }) lessonId: number,
  ): Promise<Quiz[]> {
    return this.quizService.findByLessonId(lessonId);
  }

  @Query(() => Quiz, { nullable: true })
  async quiz(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Quiz | null> {
    return this.quizService.findById(id);
  }

  @Mutation(() => Quiz)
  async createQuiz(
    @Args('question', { type: () => String }) question: string,
    @Args('options', { type: () => [String] }) options: string[],
    @Args('answer', { type: () => String }) answer: string,
    @Args('level', { type: () => String }) level: string,
    @Args('lessonId', { type: () => Int, nullable: true }) lessonId?: number,
  ): Promise<Quiz> {
    const createData: {
      question: string;
      options: string[];
      answer: string;
      level: string;
      lesson?: { connect: { id: number } };
    } = {
      question,
      options,
      answer,
      level,
    };

    if (lessonId !== undefined) {
      createData.lesson = { connect: { id: lessonId } };
    }

    return this.quizService.create(createData);
  }

  @Mutation(() => Quiz)
  async updateQuiz(
    @Args('id', { type: () => Int }) id: number,
    @Args('question', { type: () => String, nullable: true }) question?: string,
    @Args('options', { type: () => [String], nullable: true })
    options?: string[],
    @Args('answer', { type: () => String, nullable: true }) answer?: string,
    @Args('level', { type: () => String, nullable: true }) level?: string,
    @Args('lessonId', { type: () => Int, nullable: true }) lessonId?: number,
  ): Promise<Quiz> {
    const updateData: {
      question?: string;
      options?: string[];
      answer?: string;
      level?: string;
      lesson?: { connect: { id: number } } | { disconnect: true };
    } = {};
    if (question !== undefined) updateData.question = question;
    if (options !== undefined) updateData.options = options;
    if (answer !== undefined) updateData.answer = answer;
    if (level !== undefined) updateData.level = level;
    if (lessonId !== undefined) {
      updateData.lesson = { connect: { id: lessonId } };
    }

    return this.quizService.update(id, updateData);
  }

  @Mutation(() => Quiz)
  async deleteQuiz(@Args('id', { type: () => Int }) id: number): Promise<Quiz> {
    return this.quizService.delete(id);
  }
}
