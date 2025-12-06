import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Completion } from '../completions/entities/completion.entity';
import {
  AnalyticsInsight,
  DailyCompletion,
  WeeklyCompletion,
  HeatmapDataPoint,
  Streak,
  CategoryBreakdown,
} from '../../../shared/types';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Completion)
    private completionRepository: Repository<Completion>,
  ) {}

  async getDailyCompletions(days: number = 30): Promise<DailyCompletion[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const completions = await this.completionRepository
      .createQueryBuilder('completion')
      .select("DATE(completion.completed_at)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('completion.completed_at >= :startDate', { startDate })
      .groupBy('DATE(completion.completed_at)')
      .orderBy('DATE(completion.completed_at)', 'ASC')
      .getRawMany();

    return completions.map((row) => ({
      date: row.date,
      count: parseInt(row.count, 10),
    }));
  }

  async getWeeklyCompletions(weeks: number = 12): Promise<WeeklyCompletion[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - weeks * 7);

    const completions = await this.completionRepository
      .createQueryBuilder('completion')
      .select(
        "TO_CHAR(completion.completed_at, 'IYYY-IW')",
        'week',
      )
      .addSelect('COUNT(*)', 'count')
      .where('completion.completed_at >= :startDate', { startDate })
      .groupBy("TO_CHAR(completion.completed_at, 'IYYY-IW')")
      .orderBy("TO_CHAR(completion.completed_at, 'IYYY-IW')", 'ASC')
      .getRawMany();

    return completions.map((row) => ({
      week: row.week,
      count: parseInt(row.count, 10),
    }));
  }

  async getHeatmapData(): Promise<HeatmapDataPoint[]> {
    const completions = await this.completionRepository
      .createQueryBuilder('completion')
      .select('EXTRACT(HOUR FROM completion.completed_at)', 'hour')
      .addSelect('EXTRACT(DOW FROM completion.completed_at)', 'dayOfWeek')
      .addSelect('COUNT(*)', 'count')
      .groupBy('EXTRACT(HOUR FROM completion.completed_at)')
      .addGroupBy('EXTRACT(DOW FROM completion.completed_at)')
      .getRawMany();

    return completions.map((row) => ({
      hour: parseInt(row.hour, 10),
      dayOfWeek: parseInt(row.dayOfWeek, 10),
      count: parseInt(row.count, 10),
    }));
  }

  async getStreaks(): Promise<Streak[]> {
    // Get all tasks with completions
    const tasks = await this.completionRepository
      .createQueryBuilder('completion')
      .leftJoinAndSelect('completion.task', 'task')
      .select('task.id', 'taskId')
      .addSelect('task.title', 'taskTitle')
      .groupBy('task.id')
      .addGroupBy('task.title')
      .getRawMany();

    const streaks: Streak[] = [];

    for (const task of tasks) {
      const completions = await this.completionRepository.find({
        where: { taskId: task.taskId },
        order: { completedAt: 'DESC' },
      });

      if (completions.length === 0) continue;

      // Calculate current streak
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      let lastDate: Date | null = null;

      for (const completion of completions) {
        const completionDate = new Date(completion.completedAt);
        completionDate.setHours(0, 0, 0, 0);

        if (lastDate === null) {
          lastDate = completionDate;
          currentStreak = 1;
          tempStreak = 1;
          continue;
        }

        const daysDiff = Math.floor(
          (lastDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (daysDiff === 1) {
          // Consecutive day
          if (currentStreak === 0) currentStreak = 2;
          else currentStreak++;
          tempStreak++;
        } else if (daysDiff > 1) {
          // Gap in streak
          longestStreak = Math.max(longestStreak, tempStreak);
          if (currentStreak > 0) {
            // Current streak broken
            currentStreak = 0;
          }
          tempStreak = 1;
        } else {
          // Same day, continue
          tempStreak = Math.max(tempStreak, 1);
        }

        lastDate = completionDate;
        longestStreak = Math.max(longestStreak, tempStreak);
      }

      streaks.push({
        taskId: task.taskId,
        taskTitle: task.taskTitle,
        currentStreak: currentStreak > 0 ? currentStreak : 0,
        longestStreak,
      });
    }

    return streaks.sort((a, b) => b.currentStreak - a.currentStreak);
  }

  async getCategoryBreakdown(): Promise<CategoryBreakdown[]> {
    const completions = await this.completionRepository
      .createQueryBuilder('completion')
      .leftJoinAndSelect('completion.task', 'task')
      .select('task.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('task.category')
      .getRawMany();

    const total = completions.reduce(
      (sum, row) => sum + parseInt(row.count, 10),
      0,
    );

    return completions.map((row) => ({
      category: row.category || 'Uncategorized',
      count: parseInt(row.count, 10),
      percentage: total > 0 ? (parseInt(row.count, 10) / total) * 100 : 0,
    }));
  }

  async getAllAnalytics(): Promise<AnalyticsInsight> {
    const [dailyCompletions, weeklyCompletions, heatmapData, streaks, categoryBreakdown] =
      await Promise.all([
        this.getDailyCompletions(),
        this.getWeeklyCompletions(),
        this.getHeatmapData(),
        this.getStreaks(),
        this.getCategoryBreakdown(),
      ]);

    return {
      dailyCompletions,
      weeklyCompletions,
      heatmapData,
      streaks,
      categoryBreakdown,
    };
  }
}

