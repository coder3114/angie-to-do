import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Task, SuggestedTask } from '../../types';

interface TaskItemProps {
  task: Task | SuggestedTask;
  onComplete?: (taskId: number) => void;
  onPress?: () => void;
  isSuggested?: boolean;
  showSuggestionReason?: boolean;
  isCompleted?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onComplete,
  onPress,
  isSuggested = false,
  showSuggestionReason = false,
  isCompleted = false,
}) => {
  const [completed, setCompleted] = useState(isCompleted);

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const handleComplete = (e: any) => {
    e?.stopPropagation?.();
    if (onComplete) {
      setCompleted(true);
      onComplete(task.id);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100 active:bg-gray-50"
      style={{
        ...(Platform.OS === 'web' && {
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }),
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              className={`text-base font-medium flex-1 ${
                completed ? 'text-gray-400 line-through' : 'text-gray-900'
              }`}
            >
              {task.title}
            </Text>
            {isSuggested && !completed && (
              <View className="bg-blue-100 px-2 py-1 rounded-full">
                <Text className="text-xs font-medium text-blue-700">Suggested</Text>
              </View>
            )}
          </View>
          {task.category && (
            <Text className="text-sm text-gray-500 mt-1">{task.category}</Text>
          )}
          {showSuggestionReason && 'suggestionReason' in task && !completed && (
            <Text className="text-xs text-gray-400 mt-1">
              {task.suggestionReason}
            </Text>
          )}
        </View>
        {onComplete && (
          <TouchableOpacity
            onPress={handleComplete}
            className={`ml-4 w-6 h-6 border-2 rounded-full items-center justify-center ${
              completed
                ? 'bg-blue-500 border-blue-500'
                : 'border-gray-300 active:bg-blue-50'
            }`}
            style={{
              ...(Platform.OS === 'web' && {
                cursor: 'pointer',
                transition: 'all 0.2s',
              }),
            }}
          >
            {completed && (
              <Text className="text-white text-xs font-bold">✓</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

