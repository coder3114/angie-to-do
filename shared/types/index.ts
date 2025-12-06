// Shared TypeScript interfaces for both frontend and backend

export interface Task {
  id: number;
  title: string;
  category: string | null;
  isWeeklyBacklog: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Completion {
  id: number;
  taskId: number;
  completedAt: Date;
  timeOfDay: string; // Format: "HH:mm"
  notes: string | null;
  task?: Task;
}

export interface TaskNote {
  id: number;
  completionId: number;
  content: string;
  createdAt: Date;
  completion?: Completion;
}

export interface UserPattern {
  id: number;
  taskId: number;
  meanIntervalDays: number;
  lastCalculatedAt: Date;
  streakCount: number;
  task?: Task;
}

export interface SuggestedTask extends Task {
  suggestionReason: string;
  daysSinceLastCompletion: number;
  meanInterval: number;
}

export interface AnalyticsInsight {
  dailyCompletions: DailyCompletion[];
  weeklyCompletions: WeeklyCompletion[];
  heatmapData: HeatmapDataPoint[];
  streaks: Streak[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface DailyCompletion {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface WeeklyCompletion {
  week: string; // YYYY-WW
  count: number;
}

export interface HeatmapDataPoint {
  hour: number; // 0-23
  dayOfWeek: number; // 0-6 (Sunday = 0)
  count: number;
}

export interface Streak {
  taskId: number;
  taskTitle: string;
  currentStreak: number;
  longestStreak: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

// API Request/Response Types
export interface CreateTaskDto {
  title: string;
  category?: string;
  isWeeklyBacklog?: boolean;
}

export interface CreateCompletionDto {
  taskId: number;
  timeOfDay?: string;
  notes?: string;
}

export interface CreateTaskNoteDto {
  completionId: number;
  content: string;
}

