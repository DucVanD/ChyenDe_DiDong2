import { Stack } from "expo-router";
import { ToastProvider } from "./components/common/ToastProvider";

export default function RootLayout() {
  return (
    <ToastProvider>
      {/* Thêm initialRouteName="splash" để ép app chạy trang này đầu tiên */}
      <Stack initialRouteName="splash" screenOptions={{ headerShown: false }}>

        {/* Welcome / Splash */}
        <Stack.Screen name="splash" />

        {/* Auth */}
        <Stack.Screen name="(auth)" />

        {/* Main Tabs */}
        <Stack.Screen name="(main)" />

      </Stack>
    </ToastProvider>
  );
}
