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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import * as Haptics from 'expo-haptics';

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
    const isSelected = item.id === selectedId;

    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          isSelected && styles.itemSelected,
        ]}
        onPress={() => {
          Haptics.selectionAsync();
          setSelectedId(item.id);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={item.icon}
            size={22}
            color={isSelected ? Colors.primary.main : Colors.neutral.text.secondary}
          />
        </View>
        <Text
          style={[
            styles.itemText,
            isSelected && styles.itemTextSelected,
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
          <Ionicons name="chevron-back" size={24} color={Colors.neutral.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh mục</Text>
        <View style={{ width: 24 }} />
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
    backgroundColor: Colors.neutral.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
    backgroundColor: Colors.neutral.white,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  listContent: {
    paddingVertical: Spacing.sm,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.neutral.white,
  },
  itemSelected: {
    backgroundColor: Colors.primary.light + '40',
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.base,
  },
  itemText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral.text.primary,
  },
  itemTextSelected: {
    color: Colors.primary.main,
    fontWeight: Typography.fontWeight.bold,
  },
});