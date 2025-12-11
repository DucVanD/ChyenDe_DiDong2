import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Category = {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

  const categories: Category[] = [
    { id: 1, name: "Man Shirt", icon: "shirt-outline" },
    { id: 2, name: "Dress", icon: "woman-outline" },
    { id: 3, name: "Man Work", icon: "briefcase-outline" },
    { id: 4, name: "Woman Bag", icon: "bag-handle-outline" },
    { id: 5, name: "Shoes", icon: "footsteps-outline" },
  ];
export default function ProductCategory() {
  return (
    <View style={styles.container}>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.categoryItem}>
            <View style={styles.categoryIconCircle}>
              <Ionicons name={cat.icon} size={24} color="#40BFFF" />
            </View>
            <Text style={styles.categoryText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  categoryScroll: {
    flexDirection: "row",
  },

  categoryItem: {
    alignItems: "center",
    marginRight: 16,
  },

  categoryIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F2F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  categoryText: {
    fontSize: 12,
    textAlign: "center",
  },
});
