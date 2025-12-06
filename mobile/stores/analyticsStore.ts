import { create } from 'zustand';
import { AnalyticsInsight } from '../types';
import { api } from '../services/api';

interface AnalyticsState {
  analytics: AnalyticsInsight | null;
  loading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
  fetchDaily: (days?: number) => Promise<any[]>;
  fetchWeekly: (weeks?: number) => Promise<any[]>;
  fetchHeatmap: () => Promise<any[]>;
  fetchStreaks: () => Promise<any[]>;
  fetchCategories: () => Promise<any[]>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  analytics: null,
  loading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const analytics = await api.getAnalytics();
      set({ analytics, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchDaily: async (days) => {
    set({ loading: true, error: null });
    try {
      const data = await api.getDailyAnalytics(days);
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return [];
    }
  },

  fetchWeekly: async (weeks) => {
    set({ loading: true, error: null });
    try {
      const data = await api.getWeeklyAnalytics(weeks);
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return [];
    }
  },

  fetchHeatmap: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.getHeatmap();
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return [];
    }
  },

  fetchStreaks: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.getStreaks();
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return [];
    }
  },

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.getCategories();
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return [];
    }
  },
}));

