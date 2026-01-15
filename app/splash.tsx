import { Image, StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { getToken } from "@/services/auth.service";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Shadows, BorderRadius, Typography } from "@/constants/theme";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait for 1.5 seconds to show splash screen
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Check if user has valid token
        const token = await getToken();

        if (token) {
          // User is logged in, go to main app
          router.replace("/(main)");
        } else {
          // No token, go to login
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        // On error, go to login
        router.replace("/login");
      }
    };

    checkAuth();
  }, []);

  return (
    <LinearGradient
      colors={[Colors.primary.main, Colors.primary.dark]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
      </View>
      <ActivityIndicator size="large" color={Colors.neutral.white} style={{ marginTop: 20 }} />
      <Text style={styles.loadingText}>Đang kiểm tra...</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logoContainer: {
    width: 140,
    height: 140,
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    ...Shadows.lg,
  },

  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  loadingText: {
    color: Colors.neutral.white,
    marginTop: 10,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
});
