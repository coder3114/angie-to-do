import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Completion } from '../completions/entities/completion.entity';
import { UserPattern } from './entities/user-pattern.entity';
import { Task } from '../tasks/entities/task.entity';
import { SuggestedTask } from '../../../shared/types';

@Injectable()
export class SuggestionService {
  constructor(
    @InjectRepository(Completion)
    private completionRepository: Repository<Completion>,
    @InjectRepository(UserPattern)
    private userPatternRepository: Repository<UserPattern>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  /**
   * Core Smart Suggestion Logic
   * Calculates 90-day rolling average of completion intervals per task
   * Recommends when time elapsed > 80% of mean interval
   */
  async getSuggestedTasks(): Promise<SuggestedTask[]> {
    const now = new Date();
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Get all tasks (excluding weekly backlog only tasks)
    const tasks = await this.taskRepository.find({
      where: { isWeeklyBacklog: false },
    });

    const suggestedTasks: SuggestedTask[] = [];

    for (const task of tasks) {
      // Get completions in the last 90 days
      const recentCompletions = await this.completionRepository.find({
        where: {
          taskId: task.id,
          completedAt: MoreThan(ninetyDaysAgo),
        },
        order: {
          completedAt: 'DESC',
        },
      });

      if (recentCompletions.length === 0) {
        // No completions in last 90 days - suggest it
        suggestedTasks.push({
          ...task,
          suggestionReason: 'No recent completions',
          daysSinceLastCompletion: Infinity,
          meanInterval: 0,
        });
        continue;
      }

      // Calculate mean interval between completions
      let totalIntervalDays = 0;
      let intervalCount = 0;

      for (let i = 0; i < recentCompletions.length - 1; i++) {
        const current = new Date(recentCompletions[i].completedAt);
        const previous = new Date(recentCompletions[i + 1].completedAt);
        const daysDiff = (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24);
        totalIntervalDays += daysDiff;
        intervalCount++;
      }

      const meanIntervalDays =
        intervalCount > 0 ? totalIntervalDays / intervalCount : 0;

      // Update or create user pattern
      let userPattern = await this.userPatternRepository.findOne({
        where: { taskId: task.id },
      });

      if (!userPattern) {
        userPattern = this.userPatternRepository.create({
          taskId: task.id,
          meanIntervalDays,
          lastCalculatedAt: now,
        });
      } else {
        userPattern.meanIntervalDays = meanIntervalDays;
        userPattern.lastCalculatedAt = now;
      }
      await this.userPatternRepository.save(userPattern);

      // Get last completion date
      const lastCompletion = recentCompletions[0];
      const lastCompletionDate = new Date(lastCompletion.completedAt);
      const daysSinceLastCompletion =
        (now.getTime() - lastCompletionDate.getTime()) / (1000 * 60 * 60 * 24);

      // Recommend if time elapsed > 80% of mean interval
      const threshold = meanIntervalDays * 0.8;

      if (daysSinceLastCompletion >= threshold && meanIntervalDays > 0) {
        suggestedTasks.push({
          ...task,
          suggestionReason: `Last completed ${Math.round(daysSinceLastCompletion)} days ago (average: ${Math.round(meanIntervalDays)} days)`,
          daysSinceLastCompletion: Math.round(daysSinceLastCompletion * 10) / 10,
          meanInterval: Math.round(meanIntervalDays * 10) / 10,
        });
      } else if (meanIntervalDays === 0 && daysSinceLastCompletion > 7) {
        // If no pattern established but it's been more than a week
        suggestedTasks.push({
          ...task,
          suggestionReason: 'No pattern established, overdue',
          daysSinceLastCompletion: Math.round(daysSinceLastCompletion * 10) / 10,
          meanInterval: 0,
        });
      }
    }

    // Sort by priority (days since last completion / mean interval ratio)
    suggestedTasks.sort((a, b) => {
      if (a.meanInterval === 0) return -1;
      if (b.meanInterval === 0) return 1;
      const ratioA = a.daysSinceLastCompletion / a.meanInterval;
      const ratioB = b.daysSinceLastCompletion / b.meanInterval;
      return ratioB - ratioA; // Higher ratio = higher priority
    });

    return suggestedTasks;
  }
}

