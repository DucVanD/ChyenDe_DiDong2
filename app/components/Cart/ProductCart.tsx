import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface CartItemType {
  id: number;
  name: string;
  price: number;
  image: any;
  quantity: number;
}

export default function ProductCart({
  cartItems,
}: {
  cartItems: CartItemType[];
}) {
  return (
    <View style={styles.listContainer}>
      {cartItems.map((item) => (
        <View key={item.id} style={styles.cartItem}>
          {/* Image */}
          <Image source={item.image} style={styles.productImage} />

          {/* Info */}
          <View style={styles.productInfo}>
            {/* Top row */}
            <View style={styles.rowTop}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>

              <View style={styles.actionIcons}>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="heart-outline" size={20} color="#FB7181" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="trash-outline" size={20} color="#9098B1" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom row */}
            <View style={styles.rowBottom}>
              <Text style={styles.productPrice}>${item.price}</Text>

              <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.qtyBtn}>
                  <Ionicons name="remove" size={16} color="#9098B1" />
                </TouchableOpacity>

                <View style={styles.qtyValue}>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                </View>

                <TouchableOpacity style={styles.qtyBtn}>
                  <Ionicons name="add" size={16} color="#9098B1" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ))}
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
