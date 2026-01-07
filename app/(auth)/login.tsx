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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../../services/auth.service";
import { syncCartAfterLogin } from "../../services/cart.service";
import { STORAGE_KEYS } from "../../config/api.config";

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

        if (savedEmail && rememberFlag === "true") {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Error loading saved email:", error);
      }
    };
    loadSavedEmail();
  }, []);

  const handleSignIn = async () => {
    // Validation
    if (email.trim() === "" || password.trim() === "") {
      const msg = "Vui lòng nhập đầy đủ Email và Mật khẩu!";
      console.error("❌", msg);
      Alert.alert("Lỗi", msg);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const msg = "Vui lòng nhập địa chỉ email hợp lệ!";
      console.error("❌", msg);
      Alert.alert("Lỗi", msg);
      return;
    }

    console.log("🔑 Đang đăng nhập...", { email });
    setLoading(true);

    try {
      const result = await login(email, password);
      console.log("✅ Đăng nhập thành công!", result.user);

      // Save or clear email based on remember me checkbox
      if (rememberMe) {
        await AsyncStorage.setItem(STORAGE_KEYS.SAVED_EMAIL, email);
        await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, "true");
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_EMAIL);
        await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      }

      // Sync guest cart with backend
      await syncCartAfterLogin();

      // Đăng nhập thành công, chuyển hướng vào trang chủ
      router.replace("/(main)");
    } catch (error: any) {
      const errorMsg = error.message || "Vui lòng thử lại sau!";
      console.error("❌ Đăng nhập thất bại:", errorMsg);
      Alert.alert("Đăng nhập thất bại", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoWrap}>
        {/* Đảm bảo đường dẫn ảnh đúng với thư mục assets của bạn */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Welcome to E-com</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {/* Email Input */}
      <View style={styles.inputWrap}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="#777"
          style={styles.inputIcon}
        />
        <TextInput
          placeholder="Your Email"
          style={styles.input}
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail} // Cập nhật state khi gõ
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputWrap}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#777"
          style={styles.inputIcon}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword} // Cập nhật state khi gõ
        />
      </View>

      {/* Remember Me Checkbox */}
      <TouchableOpacity
        style={styles.rememberMeContainer}
        onPress={() => setRememberMe(!rememberMe)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
          {rememberMe && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
        <Text style={styles.rememberMeText}>Nhớ tài khoản email</Text>
      </TouchableOpacity>

      {/* Button Sign In */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.or}>OR</Text>

      {/* Các nút Social giữ nguyên (chưa cần xử lý) */}
      <TouchableOpacity style={styles.socialBtn}>
        <Ionicons
          name="logo-google"
          size={22}
          color="#DB4437"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.socialText}>Login with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialBtn}>
        <Ionicons
          name="logo-facebook"
          size={22}
          color="#1877F2"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.socialText}>Login with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don't have an account?{" "}
        <Link href="/register" style={styles.footerLink}>
          Register
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 25 },

  logoWrap: { alignItems: "center", marginTop: 40, marginBottom: 10 },
  logo: { width: 80, height: 80, resizeMode: "contain" },

  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "#222",
  },
  subtitle: { textAlign: "center", color: "#777", marginBottom: 25 },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
  },

  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#333" },

  button: {
    backgroundColor: "#47B5FF",
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#47B5FF",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4, // Đổ bóng cho Android
  },

  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  buttonDisabled: { opacity: 0.6 },

  or: { textAlign: "center", color: "#777", marginVertical: 15 },

  socialBtn: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    height: 55,
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  socialText: { color: "#333", fontSize: 16 },

  forgot: { textAlign: "center", color: "#47B5FF", marginTop: 5 },

  footerText: { textAlign: "center", color: "#777", marginTop: 15 },
  footerLink: { color: "#47B5FF", fontWeight: "bold" },

  // Remember Me Styles
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#47B5FF",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#47B5FF",
  },
  rememberMeText: {
    color: "#333",
    fontSize: 14,
  },
});