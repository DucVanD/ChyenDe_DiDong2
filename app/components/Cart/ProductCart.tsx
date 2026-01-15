import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { CartItem } from "@/services/cart.service";
import { showConfirm } from "@/utils/alert";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import { showToast } from "../common/Toast";

interface ProductCartProps {
  cartItems: CartItem[];
  selectedItems: Set<string>;
  onToggleItem: (itemKey: string) => void;
  onUpdate: () => void;
  onOptimisticUpdate?: (items: CartItem[]) => void;
}

export default function ProductCart({ cartItems, selectedItems, onToggleItem, onUpdate, onOptimisticUpdate }: ProductCartProps) {

  const handleUpdateQuantity = async (item: CartItem, newQty: number) => {
    if (newQty < 1) {
      showToast({ message: 'Số lượng phải lớn hơn 0', type: 'warning' });
      return;
    }

    // Optimistic update - update UI immediately
    if (onOptimisticUpdate) {
      const updatedItems = cartItems.map(cartItem =>
        cartItem.id === item.id && cartItem.selectedSize === item.selectedSize
          ? { ...cartItem, quantity: newQty }
          : cartItem
      );
      onOptimisticUpdate(updatedItems);
    }

    // Then update AsyncStorage
    const { updateQuantity } = await import("@/services/cart.service");
    const result = await updateQuantity(item.id, newQty, item.selectedSize);

    if (!result.success) {
      showToast({ message: result.message, type: 'error' });
      onUpdate();
    } else {
      onUpdate();
    }
  };

  const handleDelete = async (item: CartItem) => {
    const { removeFromCart } = await import("@/services/cart.service");

    showConfirm(
      'Xác nhận',
      'Bạn có chắc muốn xóa sản phẩm này?',
      async () => {
        // Optimistic delete
        if (onOptimisticUpdate) {
          const updatedItems = cartItems.filter(
            cartItem => !(cartItem.id === item.id && cartItem.selectedSize === item.selectedSize)
          );
          onOptimisticUpdate(updatedItems);
        }

        const result = await removeFromCart(item.id, item.selectedSize);
        if (result.success) {
          showToast({ message: 'Đã xóa sản phẩm', type: 'success' });
          onUpdate();
        } else {
          showToast({ message: result.message, type: 'error' });
          onUpdate();
        }
      }
    );
  };

  return (
    <View style={styles.listContainer}>
      {cartItems.map((item) => {
        const displayPrice = item.discountPrice || item.salePrice || 0;
        const itemKey = `${item.id}-${item.selectedSize || 'default'}`;
        const isSelected = selectedItems.has(itemKey);

        return (
          <View key={itemKey} style={styles.cartItem}>
            {/* Checkbox */}
            <TouchableOpacity
              onPress={() => onToggleItem(itemKey)}
              style={styles.checkboxContainer}
            >
              <Ionicons
                name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={isSelected ? Colors.primary.main : Colors.neutral.border}
              />
            </TouchableOpacity>

            {/* Image */}
            <Image
              source={typeof item.image === 'string' ? { uri: item.image } : item.image}
              style={styles.productImage}
            />

            {/* Info */}
            <View style={styles.productInfo}>
              {/* Top row */}
              <View style={styles.rowTop}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>

                <View style={styles.actionIcons}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleDelete(item)}
                  >
                    <Ionicons name="trash-outline" size={18} color={Colors.neutral.text.tertiary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bottom row */}
              <View style={styles.rowBottom}>
                <Text style={styles.productPrice}>
                  {(displayPrice || 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ
                </Text>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
                  >
                    <Ionicons name="remove" size={14} color={Colors.neutral.text.secondary} />
                  </TouchableOpacity>

                  <View style={styles.qtyValue}>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={14} color={Colors.neutral.text.secondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginTop: Spacing.md,
  },

  cartItem: {
    flexDirection: "row",
    padding: Spacing.md,
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.base,
    ...Shadows.md,
  },

  checkboxContainer: {
    marginRight: Spacing.sm,
    justifyContent: 'center',
  },

  productImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
    backgroundColor: Colors.neutral.bg,
  },

  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },

  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  productName: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral.text.primary,
    marginRight: 4,
  },

  actionIcons: {
    flexDirection: "row",
  },

  iconButton: {
    padding: 4,
  },

  rowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  productPrice: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.bg,
    borderRadius: BorderRadius.full,
    padding: 2,
  },

  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.neutral.white,
    borderRadius: 14,
  },

  qtyValue: {
    paddingHorizontal: Spacing.md,
    minWidth: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
});
