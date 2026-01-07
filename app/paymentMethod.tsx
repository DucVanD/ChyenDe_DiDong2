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
import { getCart, clearCart } from '@/services/cart.service';
import { createOrder } from '@/services/order.service';
import { showAlert } from '@/utils/alert';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Define Types
type PaymentMethodType = {
  id: string;
  name: string;
  iconLibrary: "Ionicons" | "FontAwesome";
  iconName: string;
};

// 2. Data Source
const paymentMethodsData: PaymentMethodType[] = [
  {
    id: '1',
    name: 'Thẻ tín dụng/Ghi nợ',
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
    name: 'Chuyển khoản ngân hàng',
    iconLibrary: 'Ionicons',
    iconName: 'business-outline',
  },
  {
    id: '4',
    name: 'Thanh toán khi nhận hàng (COD)',
    iconLibrary: 'Ionicons',
    iconName: 'cash-outline',
  },
];

const PaymentMethod = () => {
  const router = useRouter();
  const [selectedMethodId, setSelectedMethodId] = useState('4'); // COD default
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const handleCreateOrder = async () => {
    if (selectedMethodId !== '4') {
      showAlert('Thông báo', 'Hiện tại chỉ hỗ trợ thanh toán COD');
      return;
    }

    setIsCreatingOrder(true);
    try {
      // 1. Load cart
      const cart = await getCart();
      if (cart.length === 0) {
        showAlert('Lỗi', 'Giỏ hàng trống');
        return;
      }

      // 2. Load selected address from AsyncStorage
      const addressData = await AsyncStorage.getItem('checkout_address');
      let receiverName = '';
      let receiverPhone = '';
      let receiverAddress = '';

      if (addressData) {
        const parsed = JSON.parse(addressData);
        receiverName = parsed.name;
        receiverPhone = parsed.phone;
        receiverAddress = parsed.address;
      }

      // 3. Get user ID from AsyncStorage
      const { getStoredUser } = await import('@/services/auth.service');
      const user = await getStoredUser();

      if (!user) {
        showAlert('Lỗi', 'Vui lòng đăng nhập để đặt hàng');
        router.replace('/login');
        return;
      }

      // 4. Prepare order data with correct backend format
      // Calculate totals
      const subtotal = cart.reduce((sum, item) => sum + (item.discountPrice || item.salePrice || 0) * item.quantity, 0);
      const shippingFee = 0; // Free shipping for now
      const totalAmount = subtotal + shippingFee;

      const orderData = {
        userId: user.id,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        receiverEmail: user.email,
        receiverAddress: receiverAddress,
        paymentMethod: 'COD',
        note: '',
        subtotal: subtotal,
        shippingFee: shippingFee,
        discountAmount: 0,
        totalAmount: totalAmount,
        orderDetails: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          priceBuy: item.discountPrice || item.salePrice || 0
        }))
      };

      // 5. Create order
      const order = await createOrder(orderData);

      // 4. Clear cart
      await clearCart();

      // 5. Navigate to success
      router.replace('/success');

    } catch (error: any) {
      showAlert('Lỗi', error.message || 'Không thể tạo đơn hàng');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const renderItem = ({ item }: { item: PaymentMethodType }) => {
    const isSelected = item.id === selectedMethodId;
    const IconComponent = item.iconLibrary === 'Ionicons' ? Ionicons : FontAwesome;

    // Logic: Paypal specific color, others use main blue
    const iconColor = item.name === 'Paypal' ? '#00457C' : '#40BFFF';

    return (
      <TouchableOpacity
        style={[
          styles.paymentItem,
          isSelected ? styles.paymentItemActive : null,
        ]}
        onPress={() => setSelectedMethodId(item.id)}
      >
        {/* FIX: Added "as any" to item.iconName to solve the TS error */}
        <IconComponent
          name={item.iconName as any}
          size={24}
          color={iconColor}
          style={styles.paymentIcon}
        />

        <Text style={[styles.paymentName, isSelected ? styles.paymentNameActive : null]}>
          {item.name}
        </Text>

        {/* Blue Checkmark if selected */}
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#40BFFF" style={{ marginLeft: 'auto' }} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
      </View>

      {/* List */}
      <FlatList
        data={paymentMethodsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleCreateOrder}
          disabled={isCreatingOrder}
        >
          <Text style={styles.confirmButtonText}>
            {isCreatingOrder ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </Text>
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
    paddingBottom: 100, // Space for footer
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 2,
  },
  paymentItemActive: {
    backgroundColor: '#EBF0FF', // Light blue bg when active
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
    color: '#40BFFF', // Blue text when active
  },

  // Footer Button Styles
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EBF0FF',
    backgroundColor: '#fff',
    position: 'absolute',
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