import React, { useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTaskStore } from '../../stores/taskStore';
import { TaskList } from '../../components/TaskList/TaskList';

export default function BacklogScreen() {
  const {
    weeklyBacklog,
    loading,
    fetchWeeklyBacklog,
    updateTask,
  } = useTaskStore();

  useEffect(() => {
    fetchWeeklyBacklog();
  }, []);

  const handleAddToToday = useCallback(
    async (taskId: number) => {
      try {
        // Remove from weekly backlog by setting isWeeklyBacklog to false
        await updateTask(taskId, { isWeeklyBacklog: false });
        fetchWeeklyBacklog();
      } catch (error) {
        console.error('Failed to add task to today:', error);
      }
    },
    [updateTask, fetchWeeklyBacklog],
  );

  const handleRefresh = useCallback(() => {
    fetchWeeklyBacklog();
  }, [fetchWeeklyBacklog]);

  if (loading && weeklyBacklog.length === 0) {
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
            Weekly Backlog
          </Text>
          <Text className="text-sm text-gray-500">
            Tasks available to add to today
          </Text>
        </View>

        {weeklyBacklog.length === 0 ? (
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-gray-400 text-center">
              No backlog tasks. Add some tasks to your weekly backlog!
            </Text>
          </View>
        ) : (
          <View>
            {weeklyBacklog.map((task) => (
              <View
                key={task.id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900">
                      {task.title}
                    </Text>
                    {task.category && (
                      <Text className="text-sm text-gray-500 mt-1">
                        {task.category}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleAddToToday(task.id)}
                    className="ml-4 bg-blue-500 px-4 py-2 rounded-lg active:bg-blue-600"
                  >
                    <Text className="text-white font-medium text-sm">
                      + Today
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

