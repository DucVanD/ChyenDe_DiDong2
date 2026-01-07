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
} from "react-native";
import { register } from "../../services/auth.service";

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
    // Validation
    if (name.trim() === "" || email.trim() === "" || phone.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
      const msg = "Vui lòng điền đầy đủ thông tin!";
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

    // Validate phone format (Vietnamese phone number)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      const msg = "Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số)!";
      console.error("❌", msg);
      Alert.alert("Lỗi", msg);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      const msg = "Mật khẩu phải có ít nhất 6 ký tự!";
      console.error("❌", msg);
      Alert.alert("Lỗi", msg);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      const msg = "Mật khẩu xác nhận không khớp!";
      console.error("❌", msg);
      Alert.alert("Lỗi", msg);
      return;
    }

    console.log("📝 Đang đăng ký...", { name, email, phone, address, password, confirmPassword });
    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password,
        confirmPassword: confirmPassword,
        address: address.trim() || undefined, // Only send if not empty
      });

      console.log("✅ Đăng ký thành công!");

      // Xóa form
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setPassword("");
      setConfirmPassword("");

      // Hiển thị thông báo thành công
      Alert.alert(
        "Đăng ký thành công! 🎉",
        "Tài khoản của bạn đã được tạo thành công. Vui lòng đăng nhập để tiếp tục.",
        [
          {
            text: "Đăng nhập ngay",
            onPress: () => router.replace("/login"),
          },
        ]
      );

      // Auto redirect sau 2 giây nếu không bấm nút
      setTimeout(() => {
        router.replace("/login");
      }, 2000);

    } catch (error: any) {
      // Hiển thị thông báo lỗi rõ ràng
      const errorMessage = error.message || "Đăng ký thất bại. Vui lòng thử lại sau!";
      console.error("❌ Đăng ký thất bại:", errorMessage);
      Alert.alert("Đăng ký thất bại", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.logoWrap}>
          <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        </View>

        <Text style={styles.title}>Let's Get Started</Text>
        <Text style={styles.subtitle}>Create an new account</Text>

        {/* Full Name */}
        <View style={styles.inputWrap}>
          <Ionicons name="person-outline" size={20} color="#777" style={styles.inputIcon} />
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Email */}
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={20} color="#777" style={styles.inputIcon} />
          <TextInput
            placeholder="Your Email"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Phone */}
        <View style={styles.inputWrap}>
          <Ionicons name="call-outline" size={20} color="#777" style={styles.inputIcon} />
          <TextInput
            placeholder="Phone Number"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Address */}
        <View style={styles.inputWrap}>
          <Ionicons name="home-outline" size={20} color="#777" style={styles.inputIcon} />
          <TextInput
            placeholder="Address (Optional)"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Password Again */}
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Have an account?{" "}
          <Link href="/login" style={styles.footerLink}>
            Sign In
          </Link>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, backgroundColor: "#fff", padding: 25 },

  logoWrap: { alignItems: "center", marginTop: 50, marginBottom: 10 },
  logo: { width: 80, height: 80 },

  title: { fontSize: 24, textAlign: "center", fontWeight: "bold", color: "#222" },
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
    elevation: 4,
  },

  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  buttonDisabled: { opacity: 0.6 },

  footerText: { textAlign: "center", color: "#777", marginTop: 20 },
  footerLink: { color: "#47B5FF", fontWeight: "bold" },
});
