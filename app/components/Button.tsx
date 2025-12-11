import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
};

export default function Button({ title, onPress, style }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, style]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#ffd33d",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
