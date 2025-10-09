import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';
import { Quiz } from '../models';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.QuizCreateInput): Promise<Quiz> {
    return this.prisma.quiz.create({ data });
  }

  findAll(): Promise<Quiz[]> {
    return this.prisma.quiz.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findByLevel(level: string): Promise<Quiz[]> {
    return this.prisma.quiz.findMany({
      where: { level },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByLessonId(lessonId: number): Promise<Quiz[]> {
    const numericId = Number(lessonId);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new Error('Invalid lessonId value provided');
    }
    return this.prisma.quiz.findMany({
      where: { lessonId: numericId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: number): Promise<Quiz | null> {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new Error('Invalid id value provided');
    }
    return this.prisma.quiz.findUnique({
      where: { id: numericId },
    });
  }

  update(id: number, data: Prisma.QuizUpdateInput): Promise<Quiz> {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new Error('Invalid id value provided');
    }
    return this.prisma.quiz.update({
      where: { id: numericId },
      data,
    });
  }

  delete(id: number): Promise<Quiz> {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new Error('Invalid id value provided');
    }
    return this.prisma.quiz.delete({
      where: { id: numericId },
    });
  }
}
