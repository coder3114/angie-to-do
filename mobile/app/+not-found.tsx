import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-2xl font-bold mb-4">This screen doesn't exist.</Text>
        <Link href="/(tabs)" className="text-blue-500">
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

