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
  async getTasks() {
    return this.request<any[]>('/tasks');
  }

  async getWeeklyBacklog() {
    return this.request<any[]>('/tasks/backlog');
  }

  async getSuggestedTasks() {
    return this.request<any[]>('/tasks/suggested');
  }

  async createTask(data: { title: string; category?: string; isWeeklyBacklog?: boolean }) {
    return this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: number, data: Partial<any>) {
    return this.request<any>(`/tasks/${id}`, {
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
  async getCompletions(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString();
    return this.request<any[]>(`/completions${query ? `?${query}` : ''}`);
  }

  async createCompletion(data: { taskId: number; timeOfDay?: string; notes?: string }) {
    return this.request<any>('/completions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteCompletion(id: number) {
    return this.request<void>(`/completions/${id}`, {
      method: 'DELETE',
    });
  }

  async addTaskNote(data: { completionId: number; content: string }) {
    return this.request<any>('/completions/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Analytics
  async getAnalytics() {
    return this.request<any>('/analytics');
  }

  async getDailyAnalytics(days?: number) {
    const query = days ? `?days=${days}` : '';
    return this.request<any[]>(`/analytics/daily${query}`);
  }

  async getWeeklyAnalytics(weeks?: number) {
    const query = weeks ? `?weeks=${weeks}` : '';
    return this.request<any[]>(`/analytics/weekly${query}`);
  }

  async getHeatmap() {
    return this.request<any[]>('/analytics/heatmap');
  }

  async getStreaks() {
    return this.request<any[]>('/analytics/streaks');
  }

  async getCategories() {
    return this.request<any[]>('/analytics/categories');
  }
}

export const api = new ApiClient(API_BASE_URL);

