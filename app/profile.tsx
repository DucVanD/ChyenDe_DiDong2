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

// 1. Define the type for your menu items
type MenuItemType = {
  id: string;
  icon: any; // Using 'any' here prevents errors if the icon name string isn't perfect
  label: string;
  value: string;
  type: string;
};

export default function Profile() {
  const router = useRouter();

  // Dữ liệu giả lập cho Profile
  const userProfile = {
    name: 'Văn Văn Nè',
    username: 'admin@gmail.com',
    avatar: require('../assets/images/avatar.jpg'),
  };

  // 2. Apply the type to your data array
  const menuItems: MenuItemType[] = [
    {
      id: 'gender',
      icon: 'female-outline',
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
      type: 'password',
    },
  ];

  // 3. Fix: Explicitly type the 'item' parameter
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
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* 2. User Info Section */}
        <View style={styles.userInfoContainer}>
           {/* Added a safeguard for the image source to prevent crashes if local image is missing */}
          <Image 
            source={userProfile.avatar || { uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
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
});