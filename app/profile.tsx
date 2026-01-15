import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { getStoredUser, logout, UserInfo } from '../services/auth.service';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from "@/constants/theme";
import { Button } from "@/app/components/common/Button";
import * as Haptics from 'expo-haptics';

// 1. Define the type for your menu items
type MenuItemType = {
  id: string;
  icon: any;
  label: string;
  value: string;
  type: string;
};

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const storedUser = await getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      } else {
        // Nếu chưa đăng nhập thì chuyển hướng về login
        router.replace('/login');
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Refresh when screen comes into focus (e.g., returning from edit screen)
  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#40BFFF" />
        </View>
      </SafeAreaView>
    );
  }

  // Danh mục menu dựa trên dữ liệu thật
  const menuItems: MenuItemType[] = [
    {
      id: 'email',
      icon: 'mail-outline',
      label: 'Email',
      value: user?.email || '',
      type: 'text',
    },
    {
      id: 'phone',
      icon: 'phone-portrait-outline',
      label: 'Số điện thoại',
      value: user?.phone || 'Chưa cập nhật',
      type: 'text',
    },
    {
      id: 'address',
      icon: 'location-outline',
      label: 'Địa chỉ',
      value: user?.address || 'Chưa cập nhật',
      type: 'text',
    },
    {
      id: 'change_password',
      icon: 'lock-closed-outline',
      label: 'Đổi mật khẩu',
      value: '',
      type: 'navigation',
    },
  ];

  const renderMenuItem = (item: MenuItemType) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.menuItem}
        onPress={() => {
          Haptics.selectionAsync();
          if (item.id === 'change_password') {
            router.push('/change-password');
          }
        }}
      >
        <View style={styles.menuItemLeft}>
          <Ionicons name={item.icon} size={22} color={Colors.primary.main} style={styles.menuIcon} />
          <Text style={styles.menuLabel}>{item.label}</Text>
        </View>

        <View style={styles.menuItemRight}>
          <Text style={styles.menuValue} numberOfLines={1}>{item.value}</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.neutral.text.tertiary} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.neutral.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.userInfoContainer}>
          <Image
            source={user?.avatar ? { uri: user.avatar } : require('../assets/images/avatar.jpg')}
            style={styles.avatar}
          />
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{user?.name || 'Người dùng'}</Text>
            <Text style={styles.userHandle}>{user?.email}</Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <View style={{ marginBottom: Spacing.xl }}>
          <Button
            title="Chỉnh sửa hồ sơ"
            variant="primary"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/editProfile');
            }}
            icon="create-outline"
            fullWidth
          />
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => renderMenuItem(item))}

          <View style={{ marginTop: Spacing["2xl"] }}>
            <Button
              title="Đăng xuất"
              variant="outline"
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                handleLogout();
              }}
              icon="log-out-outline"
              textColor={Colors.accent.error}
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
    backgroundColor: Colors.neutral.white,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  backButton: {
    padding: 4,
  },
  contentContainer: {
    padding: Spacing.base,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
    backgroundColor: Colors.neutral.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: Spacing.lg,
    backgroundColor: Colors.neutral.bg,
  },
  userInfoText: {
    justifyContent: 'center',
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    marginBottom: 4,
  },
  userHandle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.secondary,
  },
  menuContainer: {
    marginTop: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.bg,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: Spacing.base,
    width: 24,
  },
  menuLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral.text.primary,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  menuValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.secondary,
    marginRight: 8,
    textAlign: 'right',
  },
});