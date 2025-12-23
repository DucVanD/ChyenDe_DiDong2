import React from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // 1. Import Router

// Dữ liệu giả lập cho các danh mục
const manFashionCategories = [
  { id: 1, label: "Man Shirt", icon: "shirt-outline" },
  { id: 2, label: "Man Work Equipment", icon: "briefcase-outline" },
  { id: 3, label: "Man T-Shirt", icon: "shirt" }, 
  { id: 4, label: "Man Shoes", icon: "footsteps-outline" },
  { id: 5, label: "Man Pants", icon: "list-outline" }, 
  { id: 6, label: "Man Underwear", icon: "medical-outline" }, 
];

const womanFashionCategories = [
  { id: 1, label: "Dress", icon: "woman-outline" },
  { id: 2, label: "Woman T-Shirt", icon: "shirt-outline" },
  { id: 3, label: "Woman Pants", icon: "list-outline" }, 
  { id: 4, label: "Skirt", icon: "ribbon-outline" }, 
  { id: 5, label: "Woman Bag", icon: "bag-handle-outline" },
  { id: 6, label: "High Heels", icon: "footsteps-outline" }, 
  { id: 7, label: "Bikini", icon: "woman-outline" }, 
];

// Component hiển thị một item danh mục
const CategoryItem = ({ label, icon }: { label: string; icon: any }) => (
  <TouchableOpacity style={styles.categoryItem}>
    <View style={styles.categoryIconCircle}>
      <Ionicons name={icon} size={24} color="#40BFFF" />
    </View>
    <Text style={styles.categoryLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function ExploreScreen() {
  const router = useRouter(); // 2. Khởi tạo router

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#40BFFF" style={styles.searchIcon} />
        
        {/* 3. Cập nhật logic tìm kiếm ở đây */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search Product"
          placeholderTextColor="#9098B1"
          returnKeyType="search" // Đổi nút Enter thành Search
          onSubmitEditing={(event) => {
             // Chuyển trang và truyền từ khóa
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
        onPress={() => router.push("/notifications")} // Chuyển sang trang notification
      >
        <Ionicons name="notifications-outline" size={24} color="#9098B1" />
        <View style={styles.badge} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Man Fashion Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Man Fashion</Text>
          <View style={styles.categoriesGrid}>
            {manFashionCategories.map((item) => (
              <CategoryItem key={item.id} label={item.label} icon={item.icon} />
            ))}
          </View>
        </View>

        {/* Woman Fashion Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Woman Fashion</Text>
          <View style={styles.categoriesGrid}>
            {womanFashionCategories.map((item) => (
              <CategoryItem key={item.id} label={item.label} icon={item.icon} />
            ))}
          </View>
        </View>
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