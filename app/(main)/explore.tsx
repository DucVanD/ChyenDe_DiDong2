import { getCategories, Category } from "@/services/category.service";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import FadeInStagger from "@/app/components/common/FadeInStagger";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import * as Haptics from 'expo-haptics';


// Component hiển thị một item danh mục theo hàng (List Item)
const CategoryItem = ({ item, index }: { item: Category, index: number }) => {
  const router = useRouter();

  return (
    <FadeInStagger index={index % 15}>
      <TouchableOpacity
        style={styles.categoryItem}
        activeOpacity={0.7}
        onPress={() => router.push({
          pathname: "/products",
          params: { categoryId: item.id }
        })}
      >
        <View style={styles.itemMain}>
          <View style={styles.categoryIconCircle}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.iconImage} />
            ) : (
              <Ionicons name="apps-outline" size={24} color={Colors.primary.main} />
            )}
          </View>
          <Text style={styles.categoryLabel}>{item.name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.neutral.text.tertiary} />
      </TouchableOpacity>
    </FadeInStagger>
  );
};

export default function ExploreScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={Colors.neutral.text.tertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          placeholderTextColor={Colors.neutral.text.tertiary}
          returnKeyType="search"
          onSubmitEditing={(event) => {
            router.push({
              pathname: "/products",
              params: { q: event.nativeEvent.text }
            });
          }}
        />
      </View>

      <TouchableOpacity
        style={[styles.iconButton, styles.aiButton]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push("/chat");
        }}
      >
        <MaterialCommunityIcons name="robot" size={20} color={Colors.primary.main} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        <Ionicons name="heart-outline" size={22} color={Colors.neutral.text.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push("/notifications");
        }}
      >
        <Ionicons name="notifications-outline" size={22} color={Colors.neutral.text.primary} />
        <View style={styles.badge} />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary.main} />
          <Text style={{ marginTop: 10, color: Colors.neutral.text.secondary }}>Đang tải danh mục...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Group children by parent
  const parentCategories = categories.filter(cat => !cat.parentId);
  const childCategories = categories.filter(cat => cat.parentId);

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // Space for AI Bot
      >
        {parentCategories.map(parent => {
          const children = childCategories.filter(child => child.parentId === parent.id);

          if (children.length === 0) return null;

          return (
            <View key={parent.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="folder-open-outline" size={20} color={Colors.primary.main} style={{ marginRight: 8 }} />
                <Text style={styles.sectionTitle}>{parent.name}</Text>
              </View>
              <View style={styles.categoriesList}>
                {children.map((item, index) => (
                  <CategoryItem key={item.id} item={item} index={index} />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  // --- Header Styles ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    minHeight: 68,
    gap: Spacing.md,
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.bg,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.neutral.text.primary,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral.bg,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  aiButton: {
    backgroundColor: Colors.primary.light,
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent.error,
  },

  // --- Section & Category Styles ---
  section: {
    paddingBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categoriesList: {
    backgroundColor: Colors.neutral.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.neutral.border,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.bg, // Divider internal
  },
  itemMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconCircle: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary.light,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.base,
    ...Shadows.sm,
  },
  iconImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  categoryLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral.text.primary,
    flex: 1,
  },
});