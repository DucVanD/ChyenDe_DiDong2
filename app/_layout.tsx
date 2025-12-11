import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    // Thêm initialRouteName="splash" để ép app chạy trang này đầu tiên
    <Stack initialRouteName="splash" screenOptions={{ headerShown: false }}>
      
      {/* Welcome / Splash */}
      <Stack.Screen name="splash" />

      {/* Auth */}
      <Stack.Screen name="(auth)" />

      {/* Main Tabs */}
      <Stack.Screen name="(main)" />
    </Stack>
  );
}