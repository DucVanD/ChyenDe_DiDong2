import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ComponentProps } from "react";
// 1. Cập nhật dữ liệu: Thêm Cash on Delivery
type PaymentMethodType = {
  id: string;
  name: string;
  iconLibrary: "Ionicons" | "FontAwesome";
  iconName: string;
};

const paymentMethodsData: PaymentMethodType[] = [
  {
    id: '1',
    name: 'Credit Card Or Debit',
    iconLibrary: 'Ionicons',
    iconName: 'card-outline',
  },
  {
    id: '2',
    name: 'Paypal',
    iconLibrary: 'FontAwesome',
    iconName: 'paypal',
  },
  {
    id: '3',
    name: 'Bank Transfer',
    iconLibrary: 'Ionicons',
    iconName: 'business-outline',
  },
  {
    id: '4', // ID mới
    name: 'Cash on Delivery', // Tên phương thức
    iconLibrary: 'Ionicons',
    iconName: 'cash-outline', // Icon tiền mặt
  },
];

const PaymentMethod = () => {
  const router = useRouter();
  const [selectedMethodId, setSelectedMethodId] = useState('1');

  const renderItem = ({ item }: { item: PaymentMethodType }) => {
    const isSelected = item.id === selectedMethodId;
    const IconComponent = item.iconLibrary === 'Ionicons' ? Ionicons : FontAwesome;
    
    // Logic màu icon: Paypal màu đặc trưng, còn lại dùng màu xanh chủ đạo
    const iconColor = item.name === 'Paypal' ? '#00457C' : '#40BFFF'; 

    return (
      <TouchableOpacity
        style={[
          styles.paymentItem,
          isSelected ? styles.paymentItemActive : null,
        ]}
        onPress={() => setSelectedMethodId(item.id)}
      >
        <IconComponent name={item.iconName} size={24} color={iconColor} style={styles.paymentIcon} />
        <Text style={[styles.paymentName, isSelected ? styles.paymentNameActive : null]}>
          {item.name}
        </Text>
        
        {/* Thêm dấu tích xanh nếu được chọn để UI rõ ràng hơn */}
        {isSelected && (
           <Ionicons name="checkmark-circle" size={24} color="#40BFFF" style={{marginLeft: 'auto'}} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      {/* Danh sách phương thức thanh toán */}
      <FlatList
        data={paymentMethodsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Footer Button: Nút xác nhận để đi tiếp hoặc hoàn tất */}
      <View style={styles.footer}>
        <TouchableOpacity 
            style={styles.confirmButton}
            onPress={() => {
                // Xử lý logic khi bấm Confirm (ví dụ: chuyển sang trang Success hoặc Review)
                console.log("Selected Method:", selectedMethodId);
                // router.push("/orderSuccess"); // Ví dụ chuyển trang
            }}
        >
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
        </TouchableOpacity>
      </View>

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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBF0FF',
  },
  backButton: {
    paddingRight: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#223263',
  },
  listContainer: {
    paddingBottom: 100, // Để nội dung không bị che bởi nút footer
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 2, // Tạo khoảng cách nhỏ nếu muốn
  },
  paymentItemActive: {
    backgroundColor: '#EBF0FF', // Màu nền xanh nhạt khi được chọn
  },
  paymentIcon: {
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  paymentName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#223263',
  },
  paymentNameActive: {
    color: '#40BFFF', // Đổi màu chữ khi active cho đẹp hơn
  },
  
  // Styles cho Footer Button
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EBF0FF',
    backgroundColor: '#fff',
    position: 'absolute', // Cố định ở đáy
    bottom: 0,
    left: 0,
    right: 0,
  },
  confirmButton: {
    backgroundColor: '#40BFFF',
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#40BFFF',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  confirmButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PaymentMethod;