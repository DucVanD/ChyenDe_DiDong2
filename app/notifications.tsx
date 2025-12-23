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
    <TouchableOpacity style={styles.itemContainer} onPress={() => {
        // Xử lý khi bấm vào từng mục (ví dụ: chuyển sang trang Offer)
        if(item.title === 'Offer') router.push("/(main)/offer"); // Ví dụ đường dẫn
    }}>
      <View style={styles.itemLeft}>
        <Ionicons name={item.icon} size={24} color="#40BFFF" style={styles.icon} />
        <Text style={styles.itemTitle}>{item.title}</Text>
      </View>
      
      {/* Badge số lượng thông báo */}
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
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
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
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBF0FF',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#223263',
  },
  listContent: {
    padding: 0,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0, 
    // Tạo hiệu ứng hover nhẹ hoặc tách biệt nếu cần
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
    width: 24, // Cố định chiều rộng để text thẳng hàng
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#223263',
  },
  badgeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FB7181', // Màu đỏ hồng như thiết kế
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});