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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Component hiển thị một item danh mục
const CategoryItem = ({ item }: { item: Category }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => router.push({
        pathname: "/searchProduct",
        params: { categoryId: item.id }
      })}
    >
      <View style={styles.categoryIconCircle}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={{ width: 40, height: 40 }} />
        ) : (
          <Ionicons name="apps-outline" size={24} color="#40BFFF" />
        )}
      </View>
      <Text style={styles.categoryLabel}>{item.name}</Text>
    </TouchableOpacity>
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
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#40BFFF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm"
          placeholderTextColor="#9098B1"
          returnKeyType="search"
          onSubmitEditing={(event) => {
            router.push({
              pathname: "/searchProduct",
              params: { q: event.nativeEvent.text }
            });
          }}
        />
      </View>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="heart-outline" size={24} color="#9098B1" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("/notifications")}
      >
        <Ionicons name="notifications-outline" size={24} color="#9098B1" />
        <View style={styles.badge} />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#40BFFF" />
          <Text style={{ marginTop: 10, color: '#9098B1' }}>Đang tải danh mục...</Text>
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {parentCategories.map(parent => {
          const children = childCategories.filter(child => child.parentId === parent.id);

          if (children.length === 0) return null;

          return (
            <View key={parent.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{parent.name}</Text>
              <View style={styles.categoriesGrid}>
                {children.map((item) => (
                  <CategoryItem key={item.id} item={item} />
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
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // --- Header Styles ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EBF0FF",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#EBF0FF",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 46,
    marginRight: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: "#223263",
  },
  iconButton: {
    padding: 4,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FB7181",
    borderWidth: 1,
    borderColor: "#fff",
  },

  // --- Section & Category Styles ---
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#223263",
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // Căn trái để các item không bị giãn quá mức
    marginHorizontal: -8, // Offset margin của item để căn lề
  },
  categoryItem: {
    width: "25%", // Mỗi hàng 4 item
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8, // Tạo khoảng cách giữa các item
  },
  categoryIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "#EBF0FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 10,
    color: "#9098B1",
    textAlign: "center",
  },
});