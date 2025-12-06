import React, { useEffect, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { ChartContainer } from '../components/ChartContainer/ChartContainer';
import { VictoryChart, VictoryBar, VictoryLine, VictoryPie, VictoryAxis, VictoryTheme } from 'victory-native';

export default function AnalyticsScreen() {
  const {
    analytics,
    loading,
    fetchAnalytics,
  } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleRefresh = useCallback(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const dailyChartData = useMemo(() => {
    if (!analytics?.dailyCompletions) return [];
    return analytics.dailyCompletions.map((day) => ({
      x: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      y: day.count,
    }));
  }, [analytics]);

  const weeklyChartData = useMemo(() => {
    if (!analytics?.weeklyCompletions) return [];
    return analytics.weeklyCompletions.map((week) => ({
      x: week.week,
      y: week.count,
    }));
  }, [analytics]);

  const categoryChartData = useMemo(() => {
    if (!analytics?.categoryBreakdown) return [];
    return analytics.categoryBreakdown.map((cat) => ({
      x: cat.category,
      y: cat.percentage,
    }));
  }, [analytics]);

  if (loading && !analytics) {
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
            Analytics
          </Text>
          <Text className="text-sm text-gray-500">
            Insights into your task completion patterns
          </Text>
        </View>

        {dailyChartData.length > 0 && (
          <ChartContainer title="Daily Completions">
            <VictoryChart theme={VictoryTheme.material} height={250}>
              <VictoryAxis />
              <VictoryAxis dependentAxis />
              <VictoryLine
                data={dailyChartData}
                style={{
                  data: { stroke: '#3b82f6', strokeWidth: 2 },
                }}
              />
            </VictoryChart>
          </ChartContainer>
        )}

        {weeklyChartData.length > 0 && (
          <ChartContainer title="Weekly Completions">
            <VictoryChart theme={VictoryTheme.material} height={250}>
              <VictoryAxis />
              <VictoryAxis dependentAxis />
              <VictoryBar
                data={weeklyChartData}
                style={{
                  data: { fill: '#3b82f6' },
                }}
              />
            </VictoryChart>
          </ChartContainer>
        )}

        {analytics?.streaks && analytics.streaks.length > 0 && (
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Active Streaks
            </Text>
            {analytics.streaks
              .filter((streak) => streak.currentStreak > 0)
              .map((streak) => (
                <View
                  key={streak.taskId}
                  className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900">
                      {streak.taskTitle}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      Longest: {streak.longestStreak} days
                    </Text>
                  </View>
                  <View className="bg-blue-100 px-3 py-1 rounded-full">
                    <Text className="text-blue-700 font-semibold">
                      {streak.currentStreak} 🔥
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        )}

        {categoryChartData.length > 0 && (
          <ChartContainer title="Category Breakdown">
            <VictoryChart theme={VictoryTheme.material} height={250}>
              <VictoryPie
                data={categoryChartData}
                colorScale={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']}
                labelRadius={({ innerRadius }) => (innerRadius || 0) + 30}
                style={{
                  labels: { fontSize: 12, fill: '#374151' },
                }}
              />
            </VictoryChart>
          </ChartContainer>
        )}
      </View>
    </ScrollView>
  );
}

