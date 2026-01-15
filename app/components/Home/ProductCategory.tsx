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
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";

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
                pathname: "/products",
                params: { categoryId: cat.id }
              })}
            >
              <View style={styles.categoryIconCircle}>
                {cat.image ? (
                  <Image source={{ uri: cat.image }} style={{ width: 44, height: 44 }} />
                ) : (
                  <Ionicons name="apps-outline" size={32} color={Colors.primary.main} />
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
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary.light,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    ...Shadows.sm,
  },

  categoryText: {
    fontSize: 12,
    textAlign: "center",
  },
});
