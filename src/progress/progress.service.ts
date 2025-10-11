import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { Progress } from '../models';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}
  create(data: Prisma.ProgressCreateInput): Promise<any> {
    return this.prisma.progress.create({ data });
  }

  async updateUserProgress(
    userId: number,
    data: { xp: number; streak: number; lessonsDone: number },
  ) {
    const { xp, streak, lessonsDone } = data;

    return this.prisma.progress.upsert({
      where: { userId },
      update: {
        xp,
        streak,
        lessonsDone,
        lastActive: new Date(),
      },
      create: {
        user: { connect: { id: userId } },
        xp,
        streak,
        lessonsDone,
        lastActive: new Date(),
      },
    });
  }

async completeLesson(userId: number): Promise<any> {
  if (!userId) {
    throw new Error('User ID is required to update progress');
  }

  // let userLessonProgress = await this.prisma.progress.findUnique({
  //   where: { userId },
  // });

  // if (!userLessonProgress) {
    // Create a progress record for this user if not exists
     await this.prisma.progress.create({
      data: { userId, xp: 0, streak: 0, lessonsDone: 0 },
    });
  }

  // return this.prisma.progress.update({
  //   where: { userId },
  //   data: { lessonsDone: { increment: 1 }, xp: { increment: 50 } },
  // });


}

