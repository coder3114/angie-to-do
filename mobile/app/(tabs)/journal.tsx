import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useCompletionStore } from '../../stores/completionStore';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory-native';

export default function JournalScreen() {
  const { completions, loading, fetchCompletions } = useCompletionStore();
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });

  useEffect(() => {
    const startStr = selectedDateRange.start.toISOString().split('T')[0];
    const endStr = selectedDateRange.end.toISOString().split('T')[0];
    fetchCompletions(startStr, endStr);
  }, [selectedDateRange, fetchCompletions]);

  const handleRefresh = useCallback(() => {
    const startStr = selectedDateRange.start.toISOString().split('T')[0];
    const endStr = selectedDateRange.end.toISOString().split('T')[0];
    fetchCompletions(startStr, endStr);
  }, [selectedDateRange, fetchCompletions]);

  const chartData = React.useMemo(() => {
    const dailyCounts: { [key: string]: number } = {};
    completions.forEach((completion) => {
      const date = new Date(completion.completedAt)
        .toISOString()
        .split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    return Object.entries(dailyCounts)
      .map(([date, count]) => ({
        x: date,
        y: count,
      }))
      .sort((a, b) => a.x.localeCompare(b.x));
  }, [completions]);

  if (loading && completions.length === 0) {
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
            Journal
          </Text>
          <Text className="text-sm text-gray-500">
            Timeline of your completions
          </Text>
        </View>

        {chartData.length > 0 && (
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Completion Timeline
            </Text>
            <View style={{ height: 200 }}>
              <VictoryChart theme={VictoryTheme.material} height={200}>
                <VictoryAxis />
                <VictoryAxis dependentAxis />
                <VictoryLine
                  data={chartData}
                  style={{
                    data: { stroke: '#3b82f6', strokeWidth: 2 },
                  }}
                />
              </VictoryChart>
            </View>
          </View>
        )}

        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Recent Completions
          </Text>
          {completions.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <Text className="text-gray-400 text-center">
                No completions in this date range
              </Text>
            </View>
          ) : (
            completions.map((completion) => {
              const date = new Date(completion.completedAt);
              return (
                <View
                  key={completion.id}
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-medium text-gray-900">
                        {completion.task?.title || 'Unknown Task'}
                      </Text>
                      <Text className="text-sm text-gray-500 mt-1">
                        {date.toLocaleDateString()} at {completion.timeOfDay || 'N/A'}
                      </Text>
                      {completion.notes && (
                        <Text className="text-sm text-gray-600 mt-2">
                          {completion.notes}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}

