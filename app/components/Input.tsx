import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type InputProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  placeholder?: string;
  secure?: boolean;
  value?: string;
  onChange?: (text: string) => void;
};

export default function Input({
  icon,
  placeholder,
  secure,
  value,
  onChange,
}: InputProps) {
  return (
    <View style={styles.wrapper}>
      {icon && <Ionicons name={icon} size={20} color="#9ca3af" />}

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        secureTextEntry={secure}
        value={value}
        onChangeText={onChange}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  input: {
    color: "#fff",
    flex: 1,
    marginLeft: 10,
  },
});
