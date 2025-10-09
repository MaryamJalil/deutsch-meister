import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';
import { Lesson } from '../models';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.LessonCreateInput): Promise<Lesson> {
    return this.prisma.lesson.create({
      data,
      include: { quizzes: true },
    });
  }

  findAll(): Promise<Lesson[]> {
    return this.prisma.lesson.findMany({
      include: { quizzes: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByLevel(level: string): Promise<Lesson[]> {
    return this.prisma.lesson.findMany({
      where: { level },
      include: { quizzes: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: number): Promise<Lesson | null> {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new Error('Invalid id value provided');
    }
    return this.prisma.lesson.findUnique({
      where: { id: numericId },
      include: { quizzes: true },
    });
  }

  update(id: number, data: Prisma.LessonUpdateInput): Promise<Lesson> {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new Error('Invalid id value provided');
    }
    return this.prisma.lesson.update({
      where: { id: numericId },
      data,
      include: { quizzes: true },
    });
  }

  delete(id: number): Promise<Lesson> {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new Error('Invalid id value provided');
    }
    return this.prisma.lesson.delete({
      where: { id: numericId },
    });
  }
}
