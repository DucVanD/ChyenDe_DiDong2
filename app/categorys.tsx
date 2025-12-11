import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Dữ liệu danh sách Category (Gộp chung thành 1 list như hình)
const CATEGORIES = [
  { id: "1", label: "Shirt", icon: "shirt-outline" },
  { id: "2", label: "Bikini", icon: "glasses-outline" }, // Ionicons không có icon bikini chuẩn, dùng tạm glasses hoặc icon khác
  { id: "3", label: "Dress", icon: "rose-outline" },
  { id: "4", label: "Work Equipment", icon: "briefcase-outline" },
  { id: "5", label: "Man Pants", icon: "file-tray-full-outline" }, // Mô phỏng hình dáng quần
  { id: "6", label: "Man Shoes", icon: "footsteps-outline" },
  { id: "7", label: "Man Underwear", icon: "fitness-outline" },
  { id: "8", label: "Man T-Shirt", icon: "shirt-sharp" },
  { id: "9", label: "Woman Bag", icon: "bag-handle-outline" },
  { id: "10", label: "Woman Pants", icon: "file-tray-outline" },
  { id: "11", label: "High Heels", icon: "play-forward-outline" }, // Icon giày cao gót (tương đối)
  { id: "12", label: "Woman T-Shirt", icon: "shirt-outline" },
  { id: "13", label: "Skirt", icon: "layers-outline" },
];

export default function Category() {
  const router = useRouter();
  
  // State để lưu ID của item đang được chọn (để tô màu nền)
  const [selectedId, setSelectedId] = useState<string | null>("2"); // Mặc định chọn Bikini (id: 2) giống hình

  const renderItem = ({ item }: { item: any }) => {
    // Kiểm tra xem item này có đang được chọn không
    const isSelected = item.id === selectedId;

    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          isSelected && styles.itemSelected, // Nếu chọn thì áp dụng style nền màu
        ]}
        onPress={() => setSelectedId(item.id)}
      >
        <View style={styles.iconContainer}>
          <Ionicons 
            name={item.icon} 
            size={24} 
            color="#40BFFF" // Icon luôn màu xanh
          />
        </View>
        <Text
          style={[
            styles.itemText,
            isSelected && styles.itemTextSelected, // Có thể đổi màu chữ hoặc đậm hơn nếu muốn
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER: Back Button + Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Category</Text>
      </View>

      {/* LIST CATEGORY */}
      <FlatList
        data={CATEGORIES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  // --- Header ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EBF0FF",
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#223263",
  },

  // --- List Item ---
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff", // Nền mặc định là trắng
  },
  // Style cho hiệu ứng chọn (Selected)
  itemSelected: {
    backgroundColor: "#EBF0FF", // Màu nền xanh nhạt khi được chọn (giống hình)
  },
  
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  itemText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#223263", // Màu chữ xanh đen đậm
  },
  itemTextSelected: {
    color: "#40BFFF", // (Tuỳ chọn) Đổi màu chữ thành xanh sáng khi chọn
  },
});