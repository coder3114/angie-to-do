import React, { useEffect, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTaskStore } from '../../stores/taskStore';
import { useCompletionStore } from '../../stores/completionStore';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { TaskList } from '../../components/TaskList/TaskList';
import { AnalyticsCard } from '../../components/AnalyticsCard/AnalyticsCard';

export default function DashboardScreen() {
  const {
    suggestedTasks,
    loading: tasksLoading,
    fetchSuggestedTasks,
  } = useTaskStore();
  const { createCompletion } = useCompletionStore();
  const {
    analytics,
    loading: analyticsLoading,
    fetchAnalytics,
  } = useAnalyticsStore();

  useEffect(() => {
    fetchSuggestedTasks();
    fetchAnalytics();
  }, []);

  const handleTaskComplete = useCallback(
    async (taskId: number) => {
      try {
        await createCompletion({ taskId });
        // Refresh suggested tasks after completion
        fetchSuggestedTasks();
        fetchAnalytics();
      } catch (error) {
        console.error('Failed to complete task:', error);
      }
    },
    [createCompletion, fetchSuggestedTasks, fetchAnalytics],
  );

  const handleRefresh = useCallback(() => {
    fetchSuggestedTasks();
    fetchAnalytics();
  }, [fetchSuggestedTasks, fetchAnalytics]);

  const completionRate = useMemo(() => {
    if (!analytics?.dailyCompletions || analytics.dailyCompletions.length === 0) {
      return 0;
    }
    const totalCompletions = analytics.dailyCompletions.reduce(
      (sum, day) => sum + day.count,
      0,
    );
    const days = analytics.dailyCompletions.length;
    return Math.round((totalCompletions / days) * 10) / 10;
  }, [analytics]);

  const activeStreaks = useMemo(() => {
    if (!analytics?.streaks) return 0;
    return analytics.streaks.filter((streak) => streak.currentStreak > 0).length;
  }, [analytics]);

  if (tasksLoading && suggestedTasks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Suggested Today
          </Text>
          <Text className="text-sm text-gray-500">
            Tasks recommended based on your patterns
          </Text>
        </View>

        <TaskList
          tasks={suggestedTasks}
          onTaskComplete={handleTaskComplete}
          refreshing={tasksLoading}
          onRefresh={handleRefresh}
          showSuggestionReason={true}
          emptyMessage="No suggested tasks. Great job staying on top of things!"
        />

        <View className="mt-6 mb-4">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Quick Stats
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <AnalyticsCard
                title="Avg. Daily"
                value={completionRate}
                subtitle="completions per day"
              />
            </View>
            <View className="flex-1">
              <AnalyticsCard
                title="Active Streaks"
                value={activeStreaks}
                subtitle="tasks with streaks"
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

