import { create } from 'zustand';
import { Completion } from '../types';
import { api } from '../services/api';

interface CompletionState {
  completions: Completion[];
  loading: boolean;
  error: string | null;
  fetchCompletions: (startDate?: string, endDate?: string) => Promise<void>;
  createCompletion: (data: { taskId: number; timeOfDay?: string; notes?: string }) => Promise<void>;
  deleteCompletion: (id: number) => Promise<void>;
  addNote: (completionId: number, content: string) => Promise<void>;
}

export const useCompletionStore = create<CompletionState>((set) => ({
  completions: [],
  loading: false,
  error: null,

  fetchCompletions: async (startDate?, endDate?) => {
    set({ loading: true, error: null });
    try {
      const completions = await api.getCompletions(startDate, endDate);
      set({ completions, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createCompletion: async (data) => {
    set({ loading: true, error: null });
    try {
      const completion = await api.createCompletion(data);
      set((state) => ({
        completions: [completion, ...state.completions],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteCompletion: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.deleteCompletion(id);
      set((state) => ({
        completions: state.completions.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addNote: async (completionId, content) => {
    set({ loading: true, error: null });
    try {
      await api.addTaskNote({ completionId, content });
      // Refresh completions to get updated notes
      const completions = await api.getCompletions();
      set({ completions, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));

