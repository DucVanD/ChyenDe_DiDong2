import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  Alert,
  Clipboard,
} from "react-native";
import ProductCart from "@/app/components/Cart/ProductCart";
import { useRouter } from "expo-router";
import { getCart, getCartTotal, CartItem, clearCart } from "@/services/cart.service";
import { showConfirm } from "@/utils/alert";
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { checkVoucher } from "@/services/voucher.service";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import { showToast } from "@/app/components/common/Toast";
import { Button } from "@/app/components/common/Button";

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const router = useRouter();

  // 1. Calculate Subtotal from cartItems and selectedItems
  const subtotal = React.useMemo(() => {
    const value = cartItems
      .filter(item => selectedItems.has(`${item.id}-${item.selectedSize || 'default'}`))
      .reduce((sum, item) => {
        const price = item.discountPrice || item.salePrice || 0;
        return sum + (price * item.quantity);
      }, 0);
    console.log('Memo Subtotal updated:', value);
    return value;
  }, [cartItems, selectedItems]);

  // 2. Calculate Discount based on subtotal and appliedVoucher
  const discount = React.useMemo(() => {
    if (!appliedVoucher) {
      console.log('Memo Discount: No voucher applied');
      return 0;
    }

    // Check if subtotal still meets minOrderAmount requirement
    if (appliedVoucher.minOrderAmount && subtotal < appliedVoucher.minOrderAmount) {
      console.log('Memo Discount: Requirement not met', { subtotal, min: appliedVoucher.minOrderAmount });
      return 0; // Voucher requirements not met
    }

    let amt = 0;
    if (appliedVoucher.discountType === 'PERCENTAGE') {
      amt = (subtotal * appliedVoucher.discountValue) / 100;
      if (appliedVoucher.maxDiscountAmount && amt > appliedVoucher.maxDiscountAmount) {
        amt = appliedVoucher.maxDiscountAmount;
      }
    } else {
      amt = appliedVoucher.discountValue || 0;
    }

    console.log('Memo Discount calculated:', amt);
    return Math.min(amt, subtotal); // Don't allow discount to exceed subtotal
  }, [subtotal, appliedVoucher]);

  // 3. Final Total
  const total = React.useMemo(() => {
    const shippingFee = subtotal > 0 ? 20000 : 0;
    const value = Math.max(0, subtotal + shippingFee - discount);
    console.log('Memo Total updated:', value);
    return value;
  }, [subtotal, discount]);

  const loadCart = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const cart = await getCart();
      setCartItems(cart);

      // Load selected items from storage
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const storedKeys = await AsyncStorage.getItem('cart_selected_items');
      if (storedKeys) {
        const parsedKeys = JSON.parse(storedKeys);
        // Validating with current cart (remove stale keys)
        const currentKeys = cart.map(item => `${item.id}-${item.selectedSize || 'default'}`);
        const validatedKeys = parsedKeys.filter((key: string) => currentKeys.includes(key));
        setSelectedItems(new Set(validatedKeys));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load applied voucher on mount
  useEffect(() => {
    const loadVoucher = async () => {
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const stored = await AsyncStorage.getItem('applied_voucher');
        if (stored) {
          const parsed = JSON.parse(stored);
          setAppliedVoucher(parsed);
          setCouponCode(parsed.voucherCode || '');
        }
      } catch (e) {
        console.error('Error loading stored voucher:', e);
      }
    };
    loadCart(true); // Initial load with spinner
    loadVoucher();
  }, []);

  // Auto-refresh cart when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadCart(false); // Background update without spinner
    }, [])
  );

  const handleApplyCoupon = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!couponCode.trim()) {
      showToast({ message: 'Vui lòng nhập mã giảm giá', type: 'warning' });
      return;
    }

    // Calculate order amount from selected items
    const selectedItemsArray = cartItems.filter(item =>
      selectedItems.has(`${item.id}-${item.selectedSize || 'default'}`)
    );

    if (selectedItemsArray.length === 0) {
      showToast({ message: 'Vui lòng chọn sản phẩm để áp dụng voucher', type: 'warning' });
      return;
    }

    const orderAmount = selectedItemsArray.reduce((sum, item) => {
      const price = item.discountPrice || item.salePrice || 0;
      return sum + (price * item.quantity);
    }, 0);

    try {
      const result = await checkVoucher(couponCode, orderAmount);
      console.log('Voucher check result raw:', result);

      if (result.isValid || result.valid) {
        const voucherData = {
          voucherCode: result.voucherCode || couponCode,
          discountType: result.discountType,
          discountValue: Number(result.discountValue),
          maxDiscountAmount: result.maxDiscountAmount ? Number(result.maxDiscountAmount) : undefined,
          minOrderAmount: result.minOrderAmount ? Number(result.minOrderAmount) : 0,
          discountAmount: Number(result.discountAmount),
        };

        console.log('Setting applied voucher:', voucherData);
        setAppliedVoucher(voucherData);

        // Save for persistence
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        await AsyncStorage.setItem('applied_voucher', JSON.stringify(voucherData));

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showToast({ message: `Đã áp dụng mã "${couponCode}"`, type: 'success' });
      } else {
        showToast({ message: result.message || 'Voucher không hợp lệ', type: 'error' });
      }
    } catch (error: any) {
      showToast({ message: error.message || 'Không thể áp dụng mã giảm giá', type: 'error' });
    }
  };

  const handleRemoveVoucher = async () => {
    setAppliedVoucher(null);
    setCouponCode('');

    // Remove from AsyncStorage
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.removeItem('applied_voucher');

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleToggleItem = (itemKey: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemKey)) {
      newSelected.delete(itemKey);
    } else {
      newSelected.add(itemKey);
    }
    setSelectedItems(newSelected);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Save to AsyncStorage
    const saveSelection = async (keys: string[]) => {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.setItem('cart_selected_items', JSON.stringify(keys));
    };
    saveSelection(Array.from(newSelected));
  };

  const handleToggleAll = () => {
    let newSelected: Set<string>;
    if (selectedItems.size === cartItems.length) {
      newSelected = new Set();
    } else {
      const allKeys = cartItems.map(item => `${item.id}-${item.selectedSize || 'default'}`);
      newSelected = new Set(allKeys);
    }
    setSelectedItems(newSelected);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Save to AsyncStorage
    const saveSelection = async (keys: string[]) => {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.setItem('cart_selected_items', JSON.stringify(keys));
    };
    saveSelection(Array.from(newSelected));
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
          setAppliedVoucher(null);
          setCouponCode('');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          showToast({ message: 'Giỏ hàng đã được làm trống', type: 'success' });
        } catch (error) {
          showToast({ message: 'Không thể xóa giỏ hàng', type: 'error' });
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
    // Update selected items if any item was removed
    const updatedKeys = updatedItems.map(item => `${item.id}-${item.selectedSize || 'default'}`);
    const newSelected = new Set(Array.from(selectedItems).filter(key => updatedKeys.includes(key)));
    setSelectedItems(newSelected);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.primary.main} />
        </View>
      </SafeAreaView>
    );
  }

  const selectedCount = selectedItems.size;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.selectAllContainer}
          onPress={handleToggleAll}
        >
          <Ionicons
            name={selectedItems.size === cartItems.length && cartItems.length > 0 ? "checkmark-circle" : "ellipse-outline"}
            size={22}
            color={selectedItems.size === cartItems.length && cartItems.length > 0 ? Colors.primary.main : Colors.neutral.border}
          />
          <Text style={styles.headerTitle}>Tất cả ({cartItems.length})</Text>
        </TouchableOpacity>
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
                source={{ uri: 'https://assets5.lottiefiles.com/packages/lf20_qh5z2fdq.json' }}
                autoPlay
                loop
                style={{ width: 220, height: 220 }}
              />
              <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
              <Text style={styles.emptyText}>Hãy thêm sản phẩm vào giỏ hàng!</Text>
              <View style={{ width: '100%' }}>
                <Button
                  title="Mua sắm ngay"
                  variant="primary"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/products');
                  }}
                  fullWidth
                />
              </View>
            </View>
          ) : (
            <>
              {/* LIST SẢN PHẨM */}
              <ProductCart
                cartItems={cartItems}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
                onUpdate={handleCartUpdate}
                onOptimisticUpdate={updateCartOptimistically}
              />

              {/* COUPON INPUT */}
              <View style={styles.couponContainer}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Nhập mã giảm giá"
                  placeholderTextColor={Colors.neutral.text.tertiary}
                  value={couponCode}
                  onChangeText={setCouponCode}
                  editable={!appliedVoucher}
                />
                {appliedVoucher ? (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={handleRemoveVoucher}
                  >
                    <Text style={styles.removeText}>Xóa</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={handleApplyCoupon}
                  >
                    <Text style={styles.applyText}>Áp dụng</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Applied Voucher Display */}
              {appliedVoucher && (
                <View style={[
                  styles.appliedVoucherContainer,
                  discount === 0 && { backgroundColor: Colors.accent.error + '10' }
                ]}>
                  <Ionicons
                    name={discount > 0 ? "pricetag" : "warning"}
                    size={20}
                    color={discount > 0 ? Colors.accent.success : Colors.accent.error}
                  />
                  <View style={styles.voucherInfo}>
                    <Text style={[
                      styles.voucherName,
                      discount === 0 && { color: Colors.accent.error }
                    ]}>
                      Mã giảm giá đã áp dụng
                    </Text>
                    {discount > 0 ? (
                      <Text style={styles.voucherDiscount}>
                        Giảm {discount.toLocaleString('vi-VN')}đ
                      </Text>
                    ) : (
                      <Text style={[styles.voucherDiscount, { color: Colors.accent.error }]}>
                        Đơn tối thiểu {appliedVoucher.minOrderAmount?.toLocaleString('vi-VN')}đ
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {/* --- PHẦN BỔ SUNG: TOTAL PRICING --- */}
              <View style={styles.pricingContainer}>
                {/* Items Total */}
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>
                    Sản phẩm ({selectedCount})
                  </Text>
                  <Text style={styles.pricingValue}>{subtotal.toLocaleString('vi-VN')}đ</Text>
                </View>

                {/* Voucher Discount */}
                {appliedVoucher && discount > 0 && (
                  <View style={styles.pricingRow}>
                    <Text style={styles.pricingLabel}>Giảm giá</Text>
                    <Text style={[styles.pricingValue, { color: Colors.accent.success, fontWeight: '700' }]}>
                      -{discount.toLocaleString('vi-VN')}đ
                    </Text>
                  </View>
                )}

                {/* Shipping */}
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Vận chuyển</Text>
                  <Text style={styles.pricingValue}>{subtotal > 0 ? '20.000đ' : '0đ'}</Text>
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
              <View style={{ marginTop: Spacing.md }}>
                <Button
                  title={`Thanh toán (${selectedCount})`}
                  variant="primary"
                  fullWidth
                  disabled={selectedCount === 0}
                  onPress={async () => {
                    if (selectedCount === 0) {
                      showToast({ message: 'Vui lòng chọn sản phẩm để thanh toán', type: 'warning' });
                      return;
                    }
                    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
                    await AsyncStorage.setItem('selected_cart_item_keys', JSON.stringify(Array.from(selectedItems)));
                    router.push("/addressShip");
                  }}
                />
              </View>
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
    backgroundColor: Colors.neutral.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    minHeight: 68,
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
  },
  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  clearAllText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.accent.error,
    fontWeight: Typography.fontWeight.medium,
  },
  container: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing["2xl"],
  },

  // Coupon Styles
  couponContainer: {
    flexDirection: "row",
    marginTop: Spacing.xl,
    marginBottom: Spacing.base,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    borderTopLeftRadius: BorderRadius.md,
    borderBottomLeftRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    height: 52,
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.primary,
    backgroundColor: Colors.neutral.bg,
  },
  applyButton: {
    backgroundColor: Colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    borderTopRightRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
    height: 52,
  },
  applyText: {
    color: Colors.neutral.white,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
  },

  // Pricing Breakdown Styles
  pricingContainer: {
    backgroundColor: Colors.neutral.bg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  pricingLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.secondary,
  },
  pricingValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.neutral.border,
    marginVertical: Spacing.sm,
  },
  totalLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  totalValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
  },

  // Empty Cart Styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    marginTop: Spacing.lg,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.neutral.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },


  // Remove Button
  removeButton: {
    backgroundColor: Colors.accent.error,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    borderTopRightRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
    height: 52,
  },
  removeText: {
    color: Colors.neutral.white,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
  },

  // Applied Voucher Display
  appliedVoucherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent.success + '10',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.base,
    gap: Spacing.md,
  },
  voucherInfo: {
    flex: 1,
  },
  voucherName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent.success,
  },
  voucherDiscount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.accent.success,
    marginTop: 2,
  },
});
