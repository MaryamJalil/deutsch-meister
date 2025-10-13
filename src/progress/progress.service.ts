// progress.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProgressService {
  private readonly XP_CONFIG = {
    BASE_XP_PER_LESSON: 10,
    PERFECT_LESSON_BONUS: 5,
    STREAK_MULTIPLIER: 0.1, // 10% bonus per streak day
    DAILY_GOAL_BONUS: 20,
    QUIZ_BASE_XP: 15,
  };

  constructor(private prisma: PrismaService) {}

  // Update user progress with XP calculation logic
  async updateUserProgress(
    userId: number,
    data: {
      xp?: number;
      streak?: number;
      lessonsDone?: number;
      quizzesDone?: number;
      activityType?: 'LESSON' | 'QUIZ' | 'DAILY_GOAL';
      activityData?: { accuracy?: number; score?: number };
    },
  ) {
    // Step 1: Get existing user progress or create new one
    let userProgress = await this.prisma.progress.findUnique({
      where: { userId },
    });

    if (!userProgress) {
      userProgress = await this.prisma.progress.create({
        data: {
          userId,
          xp: 0,
          streak: 0,
          lessonsDone: 0,
          quizzesDone: 0,
          lastActive: new Date(),
        },
      });
    }

    // Step 2: Calculate updated streak based on last activity
    const updatedStreak = this.calculateStreak(
      userProgress.lastActive as any,
      userProgress.streak,
    );

    // Step 3: Initialize update data with basic fields
    const updateData: any = {
      streak: updatedStreak,
      lastActive: new Date(),
    };

    // Step 4: Handle different update scenarios

    // Scenario A: Direct value updates (backward compatibility)
    if (data.xp !== undefined) {
      updateData.xp = data.xp;
    }
    if (data.streak !== undefined) {
      updateData.streak = data.streak;
    }
    if (data.lessonsDone !== undefined) {
      updateData.lessonsDone = data.lessonsDone;
    }
    if (data.quizzesDone !== undefined) {
      updateData.quizzesDone = data.quizzesDone;
    }

    // Scenario B: Activity-based updates with XP calculation
    if (data.activityType && data.activityData) {
      let xpEarned = 0;
      let lessonsIncrement = 0;
      let quizzesIncrement = 0;

      switch (data.activityType) {
        case 'LESSON':
          xpEarned = this.calculateLessonXP(
            data.activityData.accuracy || 1,
            updatedStreak,
          );
          lessonsIncrement = 1;
          break;

        case 'QUIZ':
          xpEarned = this.calculateQuizXP(
            data.activityData.score || 1,
            updatedStreak,
          );
          quizzesIncrement = 1;
          break;

        case 'DAILY_GOAL':
          xpEarned = this.XP_CONFIG.DAILY_GOAL_BONUS;
          break;
      }

      // Apply activity-based increments
      if (xpEarned > 0) {
        updateData.xp = { increment: xpEarned };
      }
      if (lessonsIncrement > 0) {
        updateData.lessonsDone = { increment: lessonsIncrement };
      }
      if (quizzesIncrement > 0) {
        updateData.quizzesDone = { increment: quizzesIncrement };
      }
    }

    // Step 5: Perform the update
    const result = await this.prisma.progress.update({
      where: { userId },
      data: updateData,
    });

    // Step 6: Check for level up and return enhanced result
    const level = this.calculateLevel(result.xp);
    const levelProgress = this.calculateLevelProgress(result.xp, level);

    return {
      ...result,
      level,
      levelProgress,
    };
  }

  // Calculate streak logic
  private calculateStreak(lastActive: Date, currentStreak: number): number {
    if (!lastActive) return 1;

    const today = new Date();
    const lastActiveDate = new Date(lastActive);

    // Reset time parts for accurate day comparison
    today.setHours(0, 0, 0, 0);
    lastActiveDate.setHours(0, 0, 0, 0);

    const timeDiff = today.getTime() - lastActiveDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    if (daysDiff === 1) {
      // Consecutive day
      return currentStreak + 1;
    } else if (daysDiff === 0) {
      // Same day
      return currentStreak;
    } else {
      // Broken streak
      return 1;
    }
  }

  // Calculate XP for lesson
  private calculateLessonXP(accuracy: number, streak: number): number {
    let xp = this.XP_CONFIG.BASE_XP_PER_LESSON;

    // Perfect lesson bonus (90%+ accuracy)
    if (accuracy >= 0.9) {
      xp += this.XP_CONFIG.PERFECT_LESSON_BONUS;
    }

    // Streak bonus (capped at 10 days for 100% bonus)
    const streakBonus = Math.floor(
      this.XP_CONFIG.BASE_XP_PER_LESSON *
        (this.XP_CONFIG.STREAK_MULTIPLIER * Math.min(streak, 10)),
    );
    xp += streakBonus;

    return xp;
  }

  // Calculate XP for quiz
  private calculateQuizXP(score: number, streak: number): number {
    let xp = Math.floor(this.XP_CONFIG.QUIZ_BASE_XP * score);

    // Streak bonus
    const streakBonus = Math.floor(
      xp * (this.XP_CONFIG.STREAK_MULTIPLIER * Math.min(streak, 10)),
    );
    xp += streakBonus;

    return xp;
  }

  // Calculate level based on XP
  private calculateLevel(xp: number): number {
    const LEVEL_THRESHOLDS = [
      0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500,
    ];
    for (let level = LEVEL_THRESHOLDS.length - 1; level >= 0; level--) {
      if (xp >= LEVEL_THRESHOLDS[level]) {
        return level + 1;
      }
    }
    return 1;
  }

  // Calculate progress to next level
  private calculateLevelProgress(xp: number, level: number): number {
    const LEVEL_THRESHOLDS = [
      0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500,
    ];
    const currentLevelXP = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextLevelXP = LEVEL_THRESHOLDS[level] || currentLevelXP * 2;

    const xpInCurrentLevel = xp - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;

    return xpNeededForNextLevel > 0
      ? xpInCurrentLevel / xpNeededForNextLevel
      : 0;
  }
  async completeLesson(userId: number): Promise<any> {
    if (!userId) {
      throw new Error('User ID is required to update progress');
    }
    await this.prisma.progress.create({
      data: { userId, xp: 0, streak: 0, lessonsDone: 0 },
    });
  }
}
