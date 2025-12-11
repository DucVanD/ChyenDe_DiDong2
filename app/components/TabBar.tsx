import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const { options } = descriptors[route.key];

        const label =
          options.title ??
          route.name.charAt(0).toUpperCase() + route.name.slice(1);

        const iconRenderer = options.tabBarIcon;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.item}
          >
            {iconRenderer &&
              iconRenderer({
                focused: isFocused,
                color: isFocused ? "#ffd33d" : "#9ca3af",
                size: 24,
              })}

            <Text style={[styles.label, isFocused && styles.activeLabel]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontSize: 12,
    color: "#9ca3af",
  },
  activeLabel: {
    color: "#ffd33d",
    fontWeight: "bold",
  },
});
