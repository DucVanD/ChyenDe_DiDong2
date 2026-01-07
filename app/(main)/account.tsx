import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView, Platform, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from 'expo-haptics';
import FadeInStagger from "@/app/components/common/FadeInStagger";

export default function Profile() {
  const router = useRouter();

  const handleLogout = () => {
    console.log("User logged out");
    // Thêm "as any" để bỏ qua lỗi kiểm tra file login chưa tồn tại
    router.replace("/login" as any);
  };

  // Thêm ": any" vào đây để tắt lỗi kiểm tra kiểu dữ liệu của props
  const MenuItem = ({ iconName, label, onPress, isLogout = false }: any) => {
    const color = isLogout ? "#FB7181" : "#40BFFF";
    const textColor = isLogout ? "#FB7181" : "#223263";

    return (
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          onPress();
        }}
        style={({ pressed }) => [
          styles.menuItem,
          { backgroundColor: pressed ? "#EBF0FF" : "#fff" }
        ]}
      >
        {/* iconName cũng được ép kiểu để không báo lỗi nếu tên icon sai */}
        <Ionicons name={iconName} size={24} color={color} />
        <Text style={[styles.menuText, { color: textColor }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài khoản</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* 1. PROFILE */}
        <FadeInStagger index={0}>
          <MenuItem
            iconName="person-outline"
            label="Hồ sơ"
            onPress={() => router.push("/profile" as any)}
          />
        </FadeInStagger>

        {/* 2. ORDER */}
        <FadeInStagger index={1}>
          <MenuItem
            iconName="bag-handle-outline"
            label="Đơn hàng"
            onPress={() => router.push("/orders" as any)}
          />
        </FadeInStagger>

        {/* 3. ADDRESS */}
        <FadeInStagger index={2}>
          <MenuItem
            iconName="location-outline"
            label="Địa chỉ"
            onPress={() => router.push("/address" as any)}
          />
        </FadeInStagger>

        {/* 4. PAYMENT */}
        <FadeInStagger index={3}>
          <MenuItem
            iconName="card-outline"
            label="Thanh toán"
            onPress={() => router.push("/payment" as any)}
          />
        </FadeInStagger>

        {/* ĐƯỜNG KẺ NGĂN CÁCH */}
        <View style={styles.separator} />

        {/* 5. LOG OUT */}
        <FadeInStagger index={4}>
          <MenuItem
            iconName="log-out-outline"
            label="Đăng xuất"
            onPress={handleLogout}
            isLogout={true}
          />
        </FadeInStagger>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EBF0FF",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#223263",
  },

  // Content
  content: {
    paddingTop: 0,
  },

  // Menu Item
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 14,
    fontWeight: "700",
  },

  // Separator
  separator: {
    height: 1,
    backgroundColor: "#EBF0FF",
    marginVertical: 10,
    marginHorizontal: 16,
  }
});