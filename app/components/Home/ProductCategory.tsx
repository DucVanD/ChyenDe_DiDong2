import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FadeInStagger from "../common/FadeInStagger";

import { Category } from "@/services/category.service";

interface Props {
  categories: Category[];
}

export default function ProductCategory({ categories }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((cat, index) => (
          <FadeInStagger key={cat.id} index={index}>
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => router.push({
                pathname: "/searchProduct",
                params: { categoryId: cat.id }
              })}
            >
              <View style={styles.categoryIconCircle}>
                {cat.image ? (
                  <Image source={{ uri: cat.image }} style={{ width: 30, height: 30 }} />
                ) : (
                  <Ionicons name="apps-outline" size={24} color="#40BFFF" />
                )}
              </View>
              <Text style={styles.categoryText} numberOfLines={1}>{cat.name}</Text>
            </TouchableOpacity>
          </FadeInStagger>
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
