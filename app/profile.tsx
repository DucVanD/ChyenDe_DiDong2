import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
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
} from 'react-native';

export default function Profile() {
  const router = useRouter();

  // Dữ liệu giả lập cho Profile
  const userProfile = {
    name: 'Văn Văn Nè',
    username: 'admin@gmail.com',
    avatar: require('../assets/images/avatar.jpg'), // Đảm bảo bạn có ảnh này hoặc thay bằng uri
    // Fallback nếu không có ảnh local:
    // avatar: { uri: 'https://i.pravatar.cc/150?img=12' }, 
  };

  // Cấu hình danh sách các mục (Items)
  const menuItems = [
    {
      id: 'gender',
      icon: 'female-outline', // Icon giới tính (giống hình mẫu)
      label: 'Gender',
      value: 'Male',
      type: 'text',
    },
    {
      id: 'birthday',
      icon: 'calendar-outline',
      label: 'Birthday',
      value: '12-12-2000',
      type: 'text',
    },
    {
      id: 'email',
      icon: 'mail-outline',
      label: 'Email',
      value: 'rex4dom@gmail.com',
      type: 'text',
    },
    {
      id: 'phone',
      icon: 'phone-portrait-outline',
      label: 'Phone Number',
      value: '(307) 555-0133',
      type: 'text',
    },
    {
      id: 'password',
      icon: 'lock-closed-outline',
      label: 'Change Password',
      value: '................',
      type: 'password', // Dùng để xử lý logic hiển thị dạng mật khẩu nếu cần
    },
  ];

  // Component render từng dòng
  const renderMenuItem = (item) => {
    return (
      <TouchableOpacity 
        key={item.id} 
        style={styles.menuItem}
        onPress={() => {
            // Xử lý sự kiện khi bấm vào từng mục
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
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        {/* View rỗng để cân giữa tiêu đề nếu cần, hoặc để trống */}
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* 2. User Info Section */}
        <View style={styles.userInfoContainer}>
          <Image 
            source={userProfile.avatar.uri ? userProfile.avatar : { uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.avatar} 
          />
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userHandle}>{userProfile.username}</Text>
          </View>
        </View>

        {/* 3. Menu List */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => renderMenuItem(item))}
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
  
  // Header Styles
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

  // User Info Styles
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36, // Bo tròn
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

  // Menu List Styles
  menuContainer: {
    
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    // borderBottomWidth: 0, // Thiết kế này thường không có line ngăn cách rõ, chỉ khoảng trắng
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
    width: 24, // Cố định chiều rộng để text thẳng hàng
  },
  menuLabel: {
    fontSize: 12, // Hoặc 14 tùy tỉ lệ màn hình
    fontWeight: '700',
    color: '#223263',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end', // Đẩy nội dung sang phải
    paddingLeft: 10,
  },
  menuValue: {
    fontSize: 12,
    color: '#9098B1',
    marginRight: 10,
    textAlign: 'right',
  },
});

