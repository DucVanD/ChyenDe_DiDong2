import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

/* ================== TYPE ================== */
type ProductType = {
  id: number;
  name: string;
  price: string;
  oldPrice: string;
  discount: string;
  image: any;
};

/* ================== DATA MOCK ================== */
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

/* ================== ITEM ================== */
const renderHorizontalProduct = ({ item }: { item: ProductType }) => (
  <TouchableOpacity style={styles.card}>
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

/* ================== COMPONENT ================== */
export default function ProductFlashSale() {
  return (
    <View>
      {/* === FLASH SALE === */}
      {/* <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Flash Sale</Text>
        <Text style={styles.seeMoreText}>See More</Text>
      </View> */}

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
