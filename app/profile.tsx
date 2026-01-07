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
  ];

  const renderMenuItem = (item: MenuItemType) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.menuItem}
        onPress={() => {
          console.log(`Pressed ${item.label}`);
        }}
      >
        <View style={styles.menuItemLeft}>
          <Ionicons name={item.icon} size={24} color="#40BFFF" style={styles.menuIcon} />
          <Text style={styles.menuLabel}>{item.label}</Text>
        </View>

        <View style={styles.menuItemRight}>
          <Text style={styles.menuValue} numberOfLines={1}>{item.value}</Text>
          <Ionicons name="chevron-forward" size={24} color="#9098B1" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
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
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/editProfile')}
        >
          <Ionicons name="create-outline" size={20} color="#40BFFF" />
          <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => renderMenuItem(item))}

          <TouchableOpacity
            style={[styles.menuItem, { marginTop: 20 }]}
            onPress={handleLogout}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="log-out-outline" size={24} color="#FB7181" style={styles.menuIcon} />
              <Text style={[styles.menuLabel, { color: '#FB7181' }]}>Đăng xuất</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9098B1" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBF0FF',
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#223263',
  },
  backButton: {
    padding: 4,
  },
  contentContainer: {
    padding: 16,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 16,
  },
  userInfoText: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#223263',
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 12,
    color: '#9098B1',
  },
  menuContainer: {

  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
    width: 24,
  },
  menuLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#223263',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: 10,
  },
  menuValue: {
    fontSize: 12,
    color: '#9098B1',
    marginRight: 10,
    textAlign: 'right',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF0FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#40BFFF',
  },
});