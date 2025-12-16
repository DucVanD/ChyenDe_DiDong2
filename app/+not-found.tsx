import { Link, Stack } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Sử dụng icon có sẵn trong Expo

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!", headerShown: false }} />
      <View style={styles.container}>
        {/* Icon minh họa */}
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle-outline" size={100} color="#FF6B6B" />
        </View>

        {/* Nội dung thông báo */}
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Page Not Found</Text>
        <Text style={styles.description}>
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </Text>

        {/* Nút quay về trang chủ */}
        <Link href="/" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Go back Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Nền trắng sạch sẽ
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 60,
    fontWeight: "900",
    color: "#223263", // Màu xanh đậm hiện đại
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#223263",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#9098B1", // Màu xám nhạt cho text phụ
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#40BFFF", // Màu xanh chủ đạo (giống app của bạn)
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30, // Bo tròn mềm mại
    shadowColor: "#40BFFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});