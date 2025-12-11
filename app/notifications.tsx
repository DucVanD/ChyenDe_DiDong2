import { View, Text, StyleSheet } from "react-native";

export default function Notifications() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo</Text>
      <Text style={styles.text}>Hiện chưa có thông báo mới.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#25292e" },
  title: { color: "#ffd33d", fontSize: 22, fontWeight: "bold" },
  text: { color: "#ccc", marginTop: 10 },
});
