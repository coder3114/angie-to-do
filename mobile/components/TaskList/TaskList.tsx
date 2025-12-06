import React from 'react';
import { ScrollView, RefreshControl, View, Text } from 'react-native';
import { TaskItem } from '../TaskItem/TaskItem';
import { Task, SuggestedTask } from '../../types';

interface TaskListProps {
  tasks: (Task | SuggestedTask)[];
  onTaskComplete?: (taskId: number) => void;
  onTaskPress?: (task: Task | SuggestedTask) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  showSuggestionReason?: boolean;
  emptyMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskComplete,
  onTaskPress,
  refreshing = false,
  onRefresh,
  showSuggestionReason = false,
  emptyMessage = 'No tasks found',
}) => {
  if (tasks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-gray-400 text-center">{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    >
      <View className="p-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={onTaskComplete}
            onPress={() => onTaskPress?.(task)}
            isSuggested={'suggestionReason' in task}
            showSuggestionReason={showSuggestionReason}
          />
        ))}
      </View>
    </ScrollView>
  );
};

