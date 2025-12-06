import React from 'react';
import { View, Text } from 'react-native';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  height?: number;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  children,
  height = 300,
}) => {
  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
      <Text className="text-lg font-semibold text-gray-900 mb-4">{title}</Text>
      <View style={{ height }}>{children}</View>
    </View>
  );
};

