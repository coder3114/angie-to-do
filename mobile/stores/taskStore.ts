import { create } from 'zustand';
import { Task, SuggestedTask } from '../types';
import { api } from '../services/api';

interface TaskState {
  tasks: Task[];
  suggestedTasks: SuggestedTask[];
  weeklyBacklog: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchSuggestedTasks: () => Promise<void>;
  fetchWeeklyBacklog: () => Promise<void>;
  createTask: (task: { title: string; category?: string; isWeeklyBacklog?: boolean }) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  suggestedTasks: [],
  weeklyBacklog: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await api.getTasks();
      set({ tasks, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchSuggestedTasks: async () => {
    set({ loading: true, error: null });
    try {
      const suggestedTasks = await api.getSuggestedTasks();
      set({ suggestedTasks, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchWeeklyBacklog: async () => {
    set({ loading: true, error: null });
    try {
      const weeklyBacklog = await api.getWeeklyBacklog();
      set({ weeklyBacklog, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createTask: async (taskData) => {
    set({ loading: true, error: null });
    try {
      const newTask = await api.createTask(taskData);
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        loading: false,
      }));
      // Refresh suggested tasks and backlog if needed
      if (taskData.isWeeklyBacklog) {
        get().fetchWeeklyBacklog();
      } else {
        get().fetchSuggestedTasks();
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateTask: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await api.updateTask(id, updates);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
        weeklyBacklog: state.weeklyBacklog.map((t) => (t.id === id ? updatedTask : t)),
        loading: false,
      }));
      get().fetchSuggestedTasks();
      get().fetchWeeklyBacklog();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        weeklyBacklog: state.weeklyBacklog.filter((t) => t.id !== id),
        suggestedTasks: state.suggestedTasks.filter((t) => t.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));

