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

type ProductType = {
  id: number;
  name: string;
  price: string;
  oldPrice: string;
  discount: string;
  image: any;
};

const flashSaleProducts: ProductType[] = [
  {
    id: 1,
    name: "FS - Nike Air Max 270 React...",
    price: "$299,43",
    oldPrice: "$534,33",
    discount: "24% Off",
    image: require("../../../assets/images/nike1.png"),
  },
  {
    id: 2,
    name: "FS - QUILTED MAXI CROS...",
    price: "$299,43",
    oldPrice: "$534,33",
    discount: "24% Off",
    image: require("../../../assets/images/nike2.png"),
  },
  {
    id: 3,
    name: "FS - Nike Zoom Gravity...",
    price: "$299,43",
    oldPrice: "$534,33",
    discount: "24% Off",
    image: require("../../../assets/images/nike1.png"),
  },
];

export default function ProductFlashSale() {
  const router = useRouter(); // <--- 2. Khởi tạo

  // <--- 3. Di chuyển vào trong
  const renderHorizontalProduct = ({ item }: { item: ProductType }) => (
    <TouchableOpacity 
      style={styles.card}
        onPress={() =>
        router.push({
          pathname: "/product/[id]", // Đường dẫn gốc (tên file)
          params: { id: item.id }    // Tham số truyền vào
        })
      }
    >
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.price}>{item.price}</Text>
      <View style={styles.row}>
        <Text style={styles.oldPrice}>{item.oldPrice}</Text>
        <Text style={styles.discount}>{item.discount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={flashSaleProducts}
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