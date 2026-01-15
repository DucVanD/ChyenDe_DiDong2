import { Link, Stack } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius, Typography, Shadows } from "@/constants/theme";
import * as Haptics from 'expo-haptics';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!", headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Icon with premium styling */}
          <View style={styles.iconContainer}>
            <Ionicons name="alert-circle-outline" size={120} color={Colors.primary.main} />
          </View>

          {/* Content */}
          <Text style={styles.title}>404</Text>
          <Text style={styles.subtitle}>Không tìm thấy trang</Text>
          <Text style={styles.description}>
            Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </Text>

          {/* Action Button */}
          <Link href="/" asChild>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            >
              <Ionicons name="home" size={20} color={Colors.neutral.white} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Về trang chủ</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.bg,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.bg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
    backgroundColor: Colors.primary.light,
    borderRadius: BorderRadius.full,
    ...Shadows.md,
  },
  title: {
    fontSize: 72,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
    marginBottom: Spacing.xs,
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.neutral.text.secondary,
    textAlign: "center",
    marginBottom: Spacing["2xl"],
    lineHeight: 24,
    maxWidth: 320,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary.main,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    ...Shadows.lg,
  },
  buttonIcon: {
    marginRight: Spacing.xs,
  },
  buttonText: {
    color: Colors.neutral.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
});
