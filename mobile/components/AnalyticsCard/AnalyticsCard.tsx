import React from 'react';
import { View, Text } from 'react-native';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
}) => {
  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-medium text-gray-600">{title}</Text>
        {icon && <View>{icon}</View>}
      </View>
      <Text className="text-2xl font-bold text-gray-900">{value}</Text>
      {subtitle && (
        <Text className="text-xs text-gray-400 mt-1">{subtitle}</Text>
      )}
    </View>
  );
};

