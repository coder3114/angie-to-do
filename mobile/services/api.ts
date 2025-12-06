import { Task, SuggestedTask, Completion, AnalyticsInsight, DailyCompletion, WeeklyCompletion, HeatmapDataPoint, Streak, CategoryBreakdown } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/tasks');
  }

  async getWeeklyBacklog(): Promise<Task[]> {
    return this.request<Task[]>('/tasks/backlog');
  }

  async getSuggestedTasks(): Promise<SuggestedTask[]> {
    return this.request<SuggestedTask[]>('/tasks/suggested');
  }

  async createTask(data: { title: string; category?: string; isWeeklyBacklog?: boolean }): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: number) {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Completions
  async getCompletions(startDate?: string, endDate?: string): Promise<Completion[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString();
    return this.request<Completion[]>(`/completions${query ? `?${query}` : ''}`);
  }

  async createCompletion(data: { taskId: number; timeOfDay?: string; notes?: string }): Promise<Completion> {
    return this.request<Completion>('/completions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteCompletion(id: number): Promise<void> {
    return this.request<void>(`/completions/${id}`, {
      method: 'DELETE',
    });
  }

  async addTaskNote(data: { completionId: number; content: string }): Promise<void> {
    return this.request<void>('/completions/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Analytics
  async getAnalytics(): Promise<AnalyticsInsight> {
    return this.request<AnalyticsInsight>('/analytics');
  }

  async getDailyAnalytics(days?: number): Promise<DailyCompletion[]> {
    const query = days ? `?days=${days}` : '';
    return this.request<DailyCompletion[]>(`/analytics/daily${query}`);
  }

  async getWeeklyAnalytics(weeks?: number): Promise<WeeklyCompletion[]> {
    const query = weeks ? `?weeks=${weeks}` : '';
    return this.request<WeeklyCompletion[]>(`/analytics/weekly${query}`);
  }

  async getHeatmap(): Promise<HeatmapDataPoint[]> {
    return this.request<HeatmapDataPoint[]>('/analytics/heatmap');
  }

  async getStreaks(): Promise<Streak[]> {
    return this.request<Streak[]>('/analytics/streaks');
  }

  async getCategories(): Promise<CategoryBreakdown[]> {
    return this.request<CategoryBreakdown[]>('/analytics/categories');
  }
}

export const api = new ApiClient(API_BASE_URL);

