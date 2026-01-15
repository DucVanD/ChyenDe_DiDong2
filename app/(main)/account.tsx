import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView, Platform, StatusBar, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert, Clipboard } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from 'expo-haptics';
import FadeInStagger from "@/app/components/common/FadeInStagger";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import { getStoredUser, UserInfo } from "@/services/auth.service";


export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getStoredUser();
      setUser(storedUser);
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/login" as any);
  };

  const MenuItem = ({ iconName, label, onPress, isLogout = false }: any) => {
    const iconColor = isLogout ? Colors.accent.error : Colors.primary.main;
    const textColor = isLogout ? Colors.accent.error : Colors.neutral.text.primary;

    return (
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          onPress();
        }}
        style={({ pressed }) => [
          styles.menuItem,
          pressed && styles.menuItemPressed
        ]}
      >
        <View style={styles.menuIconContainer}>
          <Ionicons name={iconName} size={22} color={iconColor} />
        </View>
        <Text style={[styles.menuText, { color: textColor }]}>{label}</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.neutral.text.tertiary} />
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
        {/* USER PROFILE SUMMARY */}
        <FadeInStagger index={0}>
          <Pressable
            style={styles.profileSection}
            onPress={() => router.push("/profile" as any)}
          >
            <Image
              source={user?.avatar ? { uri: user.avatar } : require('@/assets/images/avatar.jpg')}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || "Người dùng"}</Text>
              <Text style={styles.userEmail}>{user?.email || "Chưa đăng nhập"}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.neutral.text.tertiary} />
          </Pressable>
        </FadeInStagger>

        {/* 1. PROFILE */}
        <FadeInStagger index={1}>
          <MenuItem
            iconName="person-outline"
            label="Hồ sơ cá nhân"
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
    backgroundColor: Colors.neutral.bg,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  // Header
  header: {
    paddingHorizontal: Spacing.base,
    minHeight: 68,
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },

  // Content
  content: {
    paddingBottom: Spacing["2xl"],
  },

  // Profile Section
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.white,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.neutral.bg,
  },
  profileInfo: {
    flex: 1,
    marginLeft: Spacing.base,
  },
  userName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  userEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.secondary,
    marginTop: 2,
  },

  // Menu Item
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.bg,
  },
  menuItemPressed: {
    backgroundColor: Colors.neutral.bg,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.light,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    flex: 1,
    marginLeft: Spacing.base,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },

  // Separator
  separator: {
    height: Spacing.md,
  }
});