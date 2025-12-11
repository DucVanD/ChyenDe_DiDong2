import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Register() {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
      </View>

      <Text style={styles.title}>Let’s Get Started</Text>
      <Text style={styles.subtitle}>Create an new account</Text>

      {/* Full Name */}
      <View style={styles.inputWrap}>
        <Ionicons name="person-outline" size={20} color="#777" style={styles.inputIcon} />
        <TextInput placeholder="Full Name" style={styles.input} placeholderTextColor="#aaa" />
      </View>

      {/* Email */}
      <View style={styles.inputWrap}>
        <Ionicons name="mail-outline" size={20} color="#777" style={styles.inputIcon} />
        <TextInput placeholder="Your Email" style={styles.input} placeholderTextColor="#aaa" />
      </View>

      {/* Password */}
      <View style={styles.inputWrap}>
        <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} placeholderTextColor="#aaa" />
      </View>

      {/* Password Again */}
      <View style={styles.inputWrap}>
        <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
        <TextInput placeholder="Password Again" secureTextEntry style={styles.input} placeholderTextColor="#aaa" />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Have an account?{" "}
        <Link href="/login" style={styles.footerLink}>
          Sign In
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },

  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  footerText: { textAlign: "center", color: "#777", marginTop: 20 },
  footerLink: { color: "#47B5FF", fontWeight: "bold" },
});
