import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

// Định nghĩa kiểu dữ liệu cho mục thông báo
type NotificationItemType = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap; // Đảm bảo tên icon hợp lệ
  count: number;
};

const notificationData: NotificationItemType[] = [
  {
    id: '1',
    title: 'Offer',
    icon: 'pricetag-outline', // Icon nhãn giá
    count: 2,
  },
  {
    id: '2',
    title: 'Feed',
    icon: 'document-text-outline', // Icon bản tin/giấy tờ
    count: 3,
  },
  {
    id: '3',
    title: 'Activity',
    icon: 'notifications-outline', // Icon chuông
    count: 3,
  },
];

export default function NotificationScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: NotificationItemType }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        Haptics.selectionAsync();
        if (item.title === 'Offer') router.push("/(main)/offer");
      }}
    >
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={22} color={Colors.primary.main} />
        </View>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </View>

      {item.count > 0 && (
        <View style={styles.badgeCircle}>
          <Text style={styles.badgeText}>{item.count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.neutral.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Danh sách thông báo */}
      <FlatList
        data={notificationData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  listContent: {
    paddingHorizontal: Spacing.base,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.bg,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.base,
  },
  itemTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral.text.primary,
  },
  badgeCircle: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accent.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: Colors.neutral.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
});