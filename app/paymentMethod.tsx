import React, { useState, useEffect } from 'react';
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
import { getCart, removeFromCart, removePurchasedItems } from '@/services/cart.service';
import { createOrder } from '@/services/order.service';
import { createVNPayPayment } from '@/services/payment.service';
import { showAlert } from '@/utils/alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Alert } from 'react-native';

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
    name: 'VNPay',
    iconLibrary: 'Ionicons',
    iconName: 'card-outline',
  },
  {
    id: '2',
    name: 'Thanh toán khi nhận hàng (COD)',
    iconLibrary: 'Ionicons',
    iconName: 'cash-outline',
  },
];

const PaymentMethod = () => {
  const router = useRouter();
  const [selectedMethodId, setSelectedMethodId] = useState('2'); // COD default
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  useEffect(() => {
    const loadVoucher = async () => {
      const voucherData = await AsyncStorage.getItem('applied_voucher');
      if (voucherData) {
        try {
          const voucher = JSON.parse(voucherData);
          setVoucherCode(voucher.voucherCode);
          setDiscountAmount(voucher.discountAmount || 0);
        } catch (e) {
          console.error('Error loading voucher:', e);
        }
      }
    };
    loadVoucher();
  }, []);

  const handleCreateOrder = async () => {
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

      // 4. Load selected items and voucher information from AsyncStorage
      const [voucherData, selectedKeysData] = await Promise.all([
        AsyncStorage.getItem('applied_voucher'),
        AsyncStorage.getItem('selected_cart_item_keys')
      ]);

      let voucherCodeValue = null;
      let discountAmountValue = 0;
      let selectedKeys: string[] = [];

      if (voucherData) {
        try {
          const voucher = JSON.parse(voucherData);
          voucherCodeValue = voucher.voucherCode;
          discountAmountValue = voucher.discountAmount || 0;
          setVoucherCode(voucherCodeValue);
          setDiscountAmount(discountAmountValue);
        } catch (e) {
          console.error('Error parsing voucher data:', e);
        }
      }

      if (selectedKeysData) {
        try {
          selectedKeys = JSON.parse(selectedKeysData);
        } catch (e) {
          console.error('Error parsing selected keys:', e);
        }
      }

      // 5. Filter cart items to only those selected & calculate totals
      const selectedCartItems = cart.filter(item =>
        selectedKeys.includes(`${item.productId}-${item.selectedSize || 'default'}`) ||
        selectedKeys.includes(`${item.id}-${item.selectedSize || 'default'}`) // item.id is cart item id
      );

      if (selectedCartItems.length === 0 && selectedKeys.length > 0) {
        // Fallback or mismatch check if needed, but usually one of the above matches
        showAlert('Lỗi', 'Không tìm thấy sản phẩm đã chọn trong giỏ hàng');
        return;
      }

      // Use selectedCartItems if filtering worked, otherwise fallback to full cart (original behavior if keys missing)
      const finalItemsToOrder = selectedCartItems.length > 0 ? selectedCartItems : cart;

      const subtotal = finalItemsToOrder.reduce((sum, item) => sum + (item.discountPrice || item.salePrice || 0) * item.quantity, 0);
      const shippingFee = 20000;
      const totalAmount = Math.max(0, subtotal + shippingFee - discountAmountValue);

      // 6. Prepare order data
      const orderData = {
        userId: user.id,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        receiverEmail: user.email,
        receiverAddress: receiverAddress,
        paymentMethod: selectedMethodId === '1' ? 'VNPAY' : 'COD',
        note: '',
        voucherCode: voucherCodeValue || undefined,
        subtotal: subtotal,
        shippingFee: shippingFee,
        discountAmount: discountAmountValue,
        totalAmount: totalAmount,
        orderDetails: finalItemsToOrder.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          priceBuy: item.discountPrice || item.salePrice || 0
        }))
      };

      // 6. Create order
      const order = await createOrder(orderData);

      // 7. Handle payment method
      if (selectedMethodId === '1') {
        // VNPay payment
        try {
          const paymentResponse = await createVNPayPayment(order.id!);

          // Open VNPay URL in browser
          const supported = await Linking.canOpenURL(paymentResponse.paymentUrl);
          if (supported) {
            await Linking.openURL(paymentResponse.paymentUrl);

            // Redirect to payment pending page
            // NOTE: Cart will be cleared only when payment is confirmed successful
            router.replace({
              pathname: '/paymentPending',
              params: {
                orderId: order.id,
                amount: totalAmount,
              }
            });
          } else {
            showAlert('Lỗi', 'Không thể mở trang thanh toán VNPay');
          }
        } catch (error: any) {
          showAlert('Lỗi', error.message || 'Không thể tạo thanh toán VNPay');
        }
      } else {
        // COD payment: Remove only purchased items
        await removePurchasedItems(selectedKeys);

        // Clear applied voucher, selection snapshots, and persistent selections
        await Promise.all([
          AsyncStorage.removeItem('applied_voucher'),
          AsyncStorage.removeItem('selected_cart_item_keys'),
          AsyncStorage.removeItem('cart_selected_items')
        ]);

        router.replace({
          pathname: '/success',
          params: {
            orderId: order.id,
            amount: totalAmount,
            paymentMethod: 'COD'
          }
        });
      }

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

      {/* Applied Voucher Display */}
      {voucherCode && discountAmount > 0 && (
        <View style={styles.voucherBadge}>
          <Ionicons name="pricetag" size={20} color="#4CAF50" />
          <View style={styles.voucherInfo}>
            <Text style={styles.voucherCodeText}>Mã giảm giá đã áp dụng</Text>
            <Text style={styles.voucherDiscount}>
              Giảm {discountAmount.toLocaleString('vi-VN')}đ
            </Text>
          </View>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        </View>
      )}

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
  // Voucher Display Styles
  voucherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  voucherInfo: {
    flex: 1,
    marginLeft: 12,
  },
  voucherCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },
  voucherDiscount: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
});

export default PaymentMethod;