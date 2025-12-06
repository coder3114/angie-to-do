import React from 'react';
import { TouchableOpacity, Text, Platform } from 'react-native';

interface CompletionButtonProps {
  onPress: () => void;
  label?: string;
  variant?: 'primary' | 'secondary';
}

export const CompletionButton: React.FC<CompletionButtonProps> = ({
  onPress,
  label = 'Complete',
  variant = 'primary',
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-lg ${
        isPrimary
          ? 'bg-blue-500 active:bg-blue-600'
          : 'bg-gray-200 active:bg-gray-300'
      }`}
      style={{
        ...(Platform.OS === 'web' && {
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          ':hover': {
            backgroundColor: isPrimary ? '#2563eb' : '#d1d5db',
          },
        }),
      }}
    >
      <Text
        className={`font-medium ${
          isPrimary ? 'text-white' : 'text-gray-700'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

