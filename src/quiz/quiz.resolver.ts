import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
import { Quiz } from '../models';
import { QuizService } from './quiz.service';

@Resolver(() => Quiz)
export class QuizResolver {
  constructor(private readonly quizService: QuizService) {}

  // Helpers
  private validateOptionsAndAnswer(options?: string[], answer?: string): void {
    if (options !== undefined) {
      if (!Array.isArray(options) || options.length === 0) {
        throw new BadRequestException('options must be a non-empty array of strings');
      }
      if (options.some((o) => typeof o !== 'string' || o.trim() === '')) {
        throw new BadRequestException('each option must be a non-empty string');
      }
    }

    if (answer !== undefined) {
      if (typeof answer !== 'string' || answer.trim() === '') {
        throw new BadRequestException('answer must be a non-empty string');
      }
      if (options !== undefined && !options.includes(answer)) {
        throw new BadRequestException('answer must be one of the provided options');
      }
    }
  }

  private buildCreateData(params: {
    question: string;
    options: string[];
    answer: string;
    level: string;
    lessonId?: number;
  }) {
    const { question, options, answer, level, lessonId } = params;
    const data: {
      question: string;
      options: string[];
      answer: string;
      level: string;
      lesson?: { connect: { id: number } };
    } = { question, options, answer, level };

    if (lessonId !== undefined) {
      data.lesson = { connect: { id: lessonId } };
    }

    return data;
  }

  private buildUpdateData(params: {
    question?: string;
    options?: string[];
    answer?: string;
    level?: string;
    lessonId?: number;
  }) {
    const { question, options, answer, level, lessonId } = params;
    const data: {
      question?: string;
      options?: string[];
      answer?: string;
      level?: string;
      lesson?: { connect: { id: number } };
    } = {};

    if (question !== undefined) data.question = question;
    if (options !== undefined) data.options = options;
    if (answer !== undefined) data.answer = answer;
    if (level !== undefined) data.level = level;
    if (lessonId !== undefined) data.lesson = { connect: { id: lessonId } };

    return data;
  }

  // Queries
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

  // Mutations
  @Mutation(() => Quiz)
  async createQuiz(
    @Args('question', { type: () => String }) question: string,
    @Args('options', { type: () => [String] }) options: string[],
    @Args('answer', { type: () => String }) answer: string,
    @Args('level', { type: () => String }) level: string,
    @Args('lessonId', { type: () => Int, nullable: true }) lessonId?: number,
  ): Promise<Quiz> {
    this.validateOptionsAndAnswer(options, answer);

    const createData = this.buildCreateData({
      question,
      options,
      answer,
      level,
      lessonId,
    });

    return this.quizService.create(createData as any);
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
    this.validateOptionsAndAnswer(options, answer);

    const updateData = this.buildUpdateData({
      question,
      options,
      answer,
      level,
      lessonId,
    });

    return this.quizService.update(id, updateData as any);
  }

  @Mutation(() => Quiz)
  async deleteQuiz(@Args('id', { type: () => Int }) id: number): Promise<Quiz> {
    return this.quizService.delete(id);
  }
}
