// File: app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  // Ngay lập tức chuyển hướng sang trang splash
  return <Redirect href="/splash" />;
}

// app/index.tsx
// import { View, Text } from "react-native";

// export default function Index() {
//   return (
//     <View>
//       <Text>Home</Text>
//     </View>
//   );
// }
