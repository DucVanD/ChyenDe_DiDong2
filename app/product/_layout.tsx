// app/product/_layout.tsx
import { Stack } from 'expo-router';

export default function ProductLayout() {
  return (
    <Stack>
      {/* Màn hình danh sách (index.tsx) */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* Màn hình chi tiết ([id].tsx) */}
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}