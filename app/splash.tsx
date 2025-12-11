import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Splash() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() => router.replace("/login")}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#47B5FF",
    justifyContent: "center",
    alignItems: "center",
  },

  logoContainer: {
    width: 140,
    height: 140,
    backgroundColor: "#fff",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    elevation: 6, // Android shadow
  },

  logo: {
    width: 120,
    height: 120,
    // resizeMode: "contain",
    // tintColor: "#47B5FF",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#EAF6FF",
  },
});
