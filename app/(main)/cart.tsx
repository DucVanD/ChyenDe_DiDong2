import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
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
} from "react-native";
// Giả định đường dẫn component này đúng với project của bạn
import ProductCart, { CartItemType } from "@/app/components/Cart/ProductCart";
import { useRouter } from "expo-router";
const initialCartItems: CartItemType[] = [
  {
    id: 1,
    name: "Nike Air Zoom Pegasus 36 Miami",
    price: 299.43,
    image: require("../../assets/images/nike1.png"), // Thay bằng ảnh thật của bạn
    quantity: 1,
  },
  {
    id: 2,
    name: "Nike Air Zoom Pegasus 36 Miami",
    price: 299.43,
    image: require("../../assets/images/nike2.png"),
    quantity: 1,
  },
];

export default function Cart() {
  const [cartItems] = useState<CartItemType[]>(initialCartItems);
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* LIST SẢN PHẨM */}
          <ProductCart cartItems={cartItems} />

          {/* COUPON INPUT */}
          <View style={styles.couponContainer}>
            <TextInput
              style={styles.couponInput}
              placeholder="Enter Coupon Code"
              placeholderTextColor="#9098B1"
            />
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>

          {/* --- PHẦN BỔ SUNG: TOTAL PRICING --- */}
          <View style={styles.pricingContainer}>
            {/* Items Total */}
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>
                Items ({cartItems.length})
              </Text>
              <Text style={styles.pricingValue}>$598.86</Text>
            </View>

            {/* Shipping */}
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Shipping</Text>
              <Text style={styles.pricingValue}>$40.00</Text>
            </View>

            {/* Import Charges */}
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Import charges</Text>
              <Text style={styles.pricingValue}>$128.00</Text>
            </View>

            {/* Separator Line (Nét đứt) */}
            <View style={styles.separator} />

            {/* Total Price */}
            <View style={styles.pricingRow}>
              <Text style={styles.totalLabel}>Total Price</Text>
              <Text style={styles.totalValue}>$766.86</Text>
            </View>
          </View>
          {/* CHECKOUT BUTTON */}
          <TouchableOpacity
            style={styles.checkoutButton}
            // 3. THÊM SỰ KIỆN NÀY:
            // Lưu ý: Đường dẫn bên trong push phải khớp với tên file của bạn trong thư mục app
            // Ví dụ: nếu file Address là app/addressShip.js thì điền "/addressShip"
            onPress={() => router.push("/addressShip")}
          >
            <Text style={styles.checkoutText}>Check Out</Text>
          </TouchableOpacity>
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
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#223263",
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
