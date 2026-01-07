import { useRouter } from "expo-router"; // <--- 1. Import
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FadeInStagger from "../common/FadeInStagger";

import { Product } from "@/services/product.service";

interface Props {
  products: Product[];
}

export default function ProductFlashSale({ products }: Props) {
  const router = useRouter();

  const renderHorizontalProduct = ({ item, index }: { item: Product, index: number }) => (
    <FadeInStagger index={index}>
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/detail",
            params: { id: item.id }
          })
        }
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>
          {item.discountPrice
            ? (item.discountPrice || 0).toLocaleString('vi-VN')
            : (item.salePrice || 0).toLocaleString('vi-VN')}đ
        </Text>
        <View style={styles.row}>
          {item.discountPrice && (
            <>
              <Text style={styles.oldPrice}>{(item.salePrice || 0).toLocaleString('vi-VN')}đ</Text>
              <Text style={styles.discount}>
                {Math.round((1 - item.discountPrice / item.salePrice) * 100)}% Off
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    </FadeInStagger>
  );

  return (
    <View>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHorizontalProduct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (Giữ nguyên styles cũ)
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeMoreText: {
    fontSize: 14,
    color: "#40BFFF",
  },
  card: {
    width: 140,
    marginRight: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#40BFFF",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  oldPrice: {
    fontSize: 12,
    color: "#9098B1",
    textDecorationLine: "line-through",
    marginRight: 6,
  },
  discount: {
    fontSize: 12,
    color: "#FB7181",
    fontWeight: "bold",
  },
});