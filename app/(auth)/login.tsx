import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react"; // 1. Import useState
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  
  // 2. Tạo state để lưu dữ liệu nhập vào (giúp ô input gõ được chữ)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 3. Hàm xử lý đăng nhập Demo
  const handleSignIn = () => {
    // Logic giả: Chỉ cần người dùng không để trống là cho qua
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Thông báo", "Vui lòng nhập Email và Mật khẩu để demo!");
      return;
    }

    // Có thể hardcode thử một tài khoản admin nếu muốn
    // if (email !== "admin" || password !== "123") { ... }

    // Chuyển hướng vào trang chủ (Main Tabs)
    router.replace("/(main)");
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

      {/* Button Sign In */}
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
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
});