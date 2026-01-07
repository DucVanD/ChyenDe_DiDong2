import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { CartItem } from "@/services/cart.service";
import { showAlert, showConfirm } from "@/utils/alert";

interface ProductCartProps {
  cartItems: CartItem[];
  onUpdate: () => void;
  onOptimisticUpdate?: (items: CartItem[]) => void;
}

export default function ProductCart({ cartItems, onUpdate, onOptimisticUpdate }: ProductCartProps) {

  const handleUpdateQuantity = async (item: CartItem, newQty: number) => {
    if (newQty < 1) {
      showAlert('Thông báo', 'Số lượng phải lớn hơn 0');
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
      showAlert('Thông báo', result.message);
      // Reload to revert optimistic update on error
      onUpdate();
    } else {
      // Sync with storage (optional, already updated optimistically)
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
          onUpdate(); // Sync with storage
        } else {
          showAlert('Lỗi', result.message);
          onUpdate(); // Reload to revert
        }
      }
    );
  };

  return (
    <View style={styles.listContainer}>
      {cartItems.map((item) => {
        const displayPrice = item.discountPrice || item.salePrice || 0;

        return (
          <View key={`${item.id}-${item.selectedSize || 'default'}`} style={styles.cartItem}>
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
                    <Ionicons name="trash-outline" size={20} color="#9098B1" />
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
                    <Ionicons name="remove" size={16} color="#9098B1" />
                  </TouchableOpacity>

                  <View style={styles.qtyValue}>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={16} color="#9098B1" />
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
    marginTop: 16,
  },

  cartItem: {
    flexDirection: "row",
    padding: 16,
    borderWidth: 1,
    borderColor: "#EBF0FF",
    borderRadius: 5,
    marginBottom: 16,
    backgroundColor: "#fff",
  },

  productImage: {
    width: 72,
    height: 72,
    borderRadius: 5,
    marginRight: 12,
  },

  productInfo: {
    flex: 1,
  },

  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  productName: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#223263",
    marginRight: 8,
  },

  actionIcons: {
    flexDirection: "row",
  },

  iconButton: {
    marginLeft: 8,
  },

  rowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  productPrice: {
    fontSize: 12,
    fontWeight: "700",
    color: "#40BFFF",
  },

  quantityContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#EBF0FF",
    borderRadius: 5,
    height: 24,
  },

  qtyBtn: {
    width: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  qtyValue: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F7F8",
  },

  qtyText: {
    fontSize: 12,
    color: "#223263",
  },
});
