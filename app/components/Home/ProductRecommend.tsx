import { useRouter } from "expo-router"; // <--- 1. Import Router
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FadeInStagger from "../common/FadeInStagger";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

import { Product } from "@/services/product.service";

interface Props {
  products: Product[];
}

export default function ProductRecommend({ products }: Props) {
  const router = useRouter(); // <--- 2. Khởi tạo Router

  // <--- 3. Di chuyển renderItem vào bên trong để dùng được router
  const renderItem = ({ item, index }: { item: Product, index: number }) => (
    <FadeInStagger index={index}>
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/detail", // Đường dẫn gốc (tên file)
            params: { id: item.id }    // Tham số truyền vào
          })
        }
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text numberOfLines={2} style={styles.name}>
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
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      numColumns={2}
      scrollEnabled={false} // Vì trong Home đã có ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    marginRight: 8,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 140,
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