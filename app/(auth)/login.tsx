import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { login } from "../../services/auth.service";
import { syncCartAfterLogin } from "../../services/cart.service";
import { STORAGE_KEYS } from "../../config/api.config";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved email on mount
  useEffect(() => {
    const loadSavedEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_EMAIL);
        const rememberFlag = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);

        if (savedEmail) {
          setEmail(savedEmail);
        }

        if (rememberFlag === "true") {
          setRememberMe(true);
        }
      } catch (error) {
        // Silent error
      }
    };
    loadSavedEmail();
  }, []);

  const handleSignIn = async () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ email hợp lệ!");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);

      if (rememberMe) {
        await AsyncStorage.setItem(STORAGE_KEYS.SAVED_EMAIL, email);
        await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, "true");
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_EMAIL);
        await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      }

      await syncCartAfterLogin();
      router.replace("/(main)");
    } catch (error: any) {
      Alert.alert("Đăng nhập thất bại", error.message || "Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
          </View>
        </View>

        <View style={styles.contentWrap}>
          <Text style={styles.title}>Chào mừng trở lại</Text>
          <Text style={styles.subtitle}>Đăng nhập để trải nghiệm mua sắm tuyệt vời</Text>

          {/* Email Input */}
          <View style={styles.inputWrap}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={Colors.neutral.text.tertiary}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Email của bạn"
              style={styles.input}
              placeholderTextColor={Colors.neutral.text.tertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrap}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={Colors.neutral.text.tertiary}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Mật khẩu"
              secureTextEntry
              style={styles.input}
              placeholderTextColor={Colors.neutral.text.tertiary}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.rowActions}>
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Ionicons name="checkmark" size={14} color={Colors.neutral.white} />}
              </View>
              <Text style={styles.rememberMeText}>Nhớ tài khoản</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
              <Text style={styles.forgot}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.primary.main, Colors.primary.dark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.button, loading && styles.buttonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color={Colors.neutral.white} />
              ) : (
                <Text style={styles.buttonText}>Đăng Nhập</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerWrap}>
            <View style={styles.dividerLine} />
            <Text style={styles.or}>HOẶC ĐĂNG NHẬP VỚI</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Sign In */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            Chưa có tài khoản?{" "}
            <Link href="/register" style={styles.footerLink}>
              Đăng Ký ngay
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  logoWrap: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary.light,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.md,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  contentWrap: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.secondary,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.bg,
    borderRadius: BorderRadius.md,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.neutral.text.primary,
  },
  rowActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: Colors.primary.main,
    borderRadius: BorderRadius.sm,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary.main,
  },
  rememberMeText: {
    color: Colors.neutral.text.secondary,
    fontSize: Typography.fontSize.sm,
  },
  forgot: {
    color: Colors.primary.main,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.sm,
  },
  button: {
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.md,
  },
  buttonText: {
    color: Colors.neutral.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral.border,
  },
  or: {
    marginHorizontal: 16,
    color: Colors.neutral.text.tertiary,
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 1,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 32,
  },
  socialBtn: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.sm,
  },
  footerText: {
    textAlign: "center",
    color: Colors.neutral.text.secondary,
    fontSize: Typography.fontSize.sm,
  },
  footerLink: {
    color: Colors.primary.main,
    fontWeight: Typography.fontWeight.bold,
  },
});