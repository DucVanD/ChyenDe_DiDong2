import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { register } from "../../services/auth.service";
import { STORAGE_KEYS } from "../../config/api.config";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (name.trim() === "" || email.trim() === "" || phone.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ email hợp lệ!");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại hợp lệ (10 chữ số)!");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert("Lỗi", "Mật khẩu phải chứa: Chữ hoa, chữ thường, số và ký tự đặc biệt!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password,
        confirmPassword: confirmPassword,
        address: address.trim() || undefined,
      });

      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_EMAIL, email.trim());

      Alert.alert(
        "Đăng ký thành công! 🎉",
        "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.",
        [{ text: "Đăng nhập ngay", onPress: () => router.replace("/login") }]
      );
    } catch (error: any) {
      Alert.alert("Đăng ký thất bại", error.message || "Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.neutral.text.primary} />
          </TouchableOpacity>

          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
            </View>
          </View>

          <Text style={styles.title}>Bắt đầu ngay</Text>
          <Text style={styles.subtitle}>Tạo tài khoản để trải nghiệm tốt nhất</Text>

          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
              <TextInput
                placeholder="Họ và tên"
                style={styles.input}
                placeholderTextColor={Colors.neutral.text.tertiary}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email */}
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
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

            {/* Phone */}
            <View style={styles.inputWrap}>
              <Ionicons name="call-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
              <TextInput
                placeholder="Số điện thoại"
                style={styles.input}
                placeholderTextColor={Colors.neutral.text.tertiary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Address */}
            <View style={styles.inputWrap}>
              <Ionicons name="home-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
              <TextInput
                placeholder="Địa chỉ (Tùy chọn)"
                style={styles.input}
                placeholderTextColor={Colors.neutral.text.tertiary}
                value={address}
                onChangeText={setAddress}
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
              <TextInput
                placeholder="Mật khẩu"
                secureTextEntry
                style={styles.input}
                placeholderTextColor={Colors.neutral.text.tertiary}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
              <TextInput
                placeholder="Xác nhận mật khẩu"
                secureTextEntry
                style={styles.input}
                placeholderTextColor={Colors.neutral.text.tertiary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
              style={{ marginTop: 16 }}
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
                  <Text style={styles.buttonText}>Đăng Ký</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            Đã có tài khoản?{" "}
            <Link href="/login" style={styles.footerLink}>
              Đăng Nhập ngay
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  backBtn: {
    marginTop: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary.light,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.md,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
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
  form: {
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
