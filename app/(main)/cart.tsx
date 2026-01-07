import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import ProductCart from "@/app/components/Cart/ProductCart";
import { useRouter } from "expo-router";
import { getCart, getCartTotal, CartItem, clearCart } from "@/services/cart.service";
import { showAlert, showConfirm } from "@/utils/alert";
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const router = useRouter();

  const loadCart = async () => {
    try {
      setLoading(true);
      const cart = await getCart();
      const cartTotal = await getCartTotal();
      setCartItems(cart);
      setTotal(cartTotal);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh cart when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadCart();
    }, [])
  );

  const handleApplyCoupon = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!couponCode.trim()) {
      showAlert('Thông báo', 'Vui lòng nhập mã giảm giá');
      return;
    }
    // TODO: Integrate with voucher API when ready
    showAlert('Thông báo', `Mã "${couponCode}" chưa được hỗ trợ.\nTính năng đang phát triển!`);
  };

  const handleClearCart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    showConfirm(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?',
      async () => {
        try {
          await clearCart();
          await loadCart();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          showAlert('Thành công', 'Giỏ hàng đã được làm trống');
        } catch (error) {
          showAlert('Lỗi', 'Không thể xóa giỏ hàng');
        }
      }
    );
  };

  // Optimistic update for immediate UI feedback
  const handleCartUpdate = async () => {
    // Reload cart and recalculate total
    await loadCart();
  };

  // Update cart items optimistically before reload
  const updateCartOptimistically = (updatedItems: CartItem[]) => {
    setCartItems(updatedItems);
    // Recalculate total immediately
    const newTotal = updatedItems.reduce((sum, item) => {
      const price = item.discountPrice || item.salePrice || 0;
      return sum + (price * item.quantity);
    }, 0);
    setTotal(newTotal);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearAllText}>Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {cartItems.length === 0 ? (
            // Empty Cart State
            <View style={styles.emptyContainer}>
              <LottieView
                source={{ uri: 'https://assets5.lottiefiles.com/packages/lf20_qh5z2fdq.json' }} // Empty cart animation
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
              <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
              <Text style={styles.emptyText}>Hãy thêm sản phẩm vào giỏ hàng!</Text>
              <TouchableOpacity
                style={styles.shopNowButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push('/(main)');
                }}
              >
                <Text style={styles.shopNowText}>Mua sắm ngay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* LIST SẢN PHẨM */}
              <ProductCart
                cartItems={cartItems}
                onUpdate={handleCartUpdate}
                onOptimisticUpdate={updateCartOptimistically}
              />

              {/* COUPON INPUT */}
              <View style={styles.couponContainer}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Nhập mã giảm giá"
                  placeholderTextColor="#9098B1"
                  value={couponCode}
                  onChangeText={setCouponCode}
                />
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApplyCoupon}
                >
                  <Text style={styles.applyText}>Áp dụng</Text>
                </TouchableOpacity>
              </View>

              {/* --- PHẦN BỔ SUNG: TOTAL PRICING --- */}
              <View style={styles.pricingContainer}>
                {/* Items Total */}
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>
                    Sản phẩm ({cartItems.length})
                  </Text>
                  <Text style={styles.pricingValue}>{(total || 0).toLocaleString('vi-VN')}đ</Text>
                </View>

                {/* Shipping */}
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Vận chuyển</Text>
                  <Text style={styles.pricingValue}>0đ</Text>
                </View>

                {/* Separator Line (Nét đứt) */}
                <View style={styles.separator} />

                {/* Total Price */}
                <View style={styles.pricingRow}>
                  <Text style={styles.totalLabel}>Tổng cộng</Text>
                  <Text style={styles.totalValue}>{(total || 0).toLocaleString('vi-VN')}đ</Text>
                </View>
              </View>
              {/* CHECKOUT BUTTON */}
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => {
                  if (cartItems.length === 0) {
                    showAlert('Thông báo', 'Giỏ hàng trống');
                    return;
                  }
                  // Navigate to address screen
                  router.push("/addressShip");
                }}
              >
                <Text style={styles.checkoutText}>Thanh toán</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EBF0FF",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#223263",
  },
  clearAllText: {
    fontSize: 14,
    color: '#FB7181', // Màu đỏ nhẹ cho nút xóa
    fontWeight: '600',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20, // Thêm padding đáy để không bị sát nút
  },

  // Coupon Styles
  couponContainer: {
    flexDirection: "row",
    marginTop: 32, // Khoảng cách với list sản phẩm
    marginBottom: 16,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#EBF0FF",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 16,
    height: 56, // Tăng chiều cao lên chút cho giống hình
    fontSize: 12,
    color: "#223263",
  },
  applyButton: {
    backgroundColor: "#40BFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    height: 56,
  },
  applyText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  // --- Pricing Breakdown Styles (Mới thêm) ---
  pricingContainer: {
    borderWidth: 1,
    borderColor: "#EBF0FF",
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pricingLabel: {
    fontSize: 12,
    color: "#9098B1", // Màu xám nhạt
  },
  pricingValue: {
    fontSize: 12,
    color: "#223263", // Màu đen đậm
  },
  separator: {
    height: 1,
    borderWidth: 1,
    borderColor: "#EBF0FF",
    borderStyle: "dashed", // Tạo nét đứt (chỉ hoạt động tốt trên một số view, nếu ko hiện có thể dùng thư viện svg)
    // Fallback cho nét đứt đơn giản:
    borderRadius: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#223263",
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#40BFFF", // Màu xanh dương cho tổng tiền
  },

  // Empty Cart Styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#223263',
    marginTop: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#9098B1',
    marginTop: 12,
    marginBottom: 32,
  },
  shopNowButton: {
    backgroundColor: '#40BFFF',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 5,
  },
  shopNowText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  // Checkout Button
  checkoutButton: {
    backgroundColor: "#40BFFF",
    height: 56,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#40BFFF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5, // Đổ bóng cho nút đẹp hơn
    marginBottom: 16,
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
