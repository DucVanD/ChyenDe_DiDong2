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

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

type ProductType = {
  id: number;
  name: string;
  price: string;
  oldPrice: string;
  discount: string;
  image: any;
};

const recommendProducts: ProductType[] = [
  {
    id: 1,
    name: "Nike Air Max 270 React ENG",
    price: "$299,43",
    oldPrice: "$534,33",
    discount: "24% Off",
    image: require("../../../assets/images/nike1.png"),
  },
  {
    id: 2,
    name: "Nike Air Max 270 React ENG",
    price: "$299,43",
    oldPrice: "$534,33",
    discount: "24% Off",
    image: require("../../../assets/images/nike2.png"),
  },
  {
    id: 3,
    name: "Nike Air Max 270 React ENG",
    price: "$299,43",
    oldPrice: "$534,33",
    discount: "24% Off",
    image: require("../../../assets/images/nike1.png"),
  },
  {
    id: 4,
    name: "Nike Air Max 270 React ENG",
    price: "$299,43",
    oldPrice: "$534,33",
    discount: "24% Off",
    image: require("../../../assets/images/nike2.png"),
  },
];

export default function ProductRecommend() {
  const router = useRouter(); // <--- 2. Khởi tạo Router

  // <--- 3. Di chuyển renderItem vào bên trong để dùng được router
  const renderItem = ({ item }: { item: ProductType }) => (
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
      <Text numberOfLines={2} style={styles.name}>
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
    <FlatList
      data={recommendProducts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      numColumns={2}
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