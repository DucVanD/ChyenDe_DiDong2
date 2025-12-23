import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (Fix lỗi "implicitly has an 'any' type")
interface ProductType {
  id: string;
  title: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: number;
  reviews: number;
  image: string;
}

// Dữ liệu giả lập
const productsData: ProductType[] = [
  {
    id: "1",
    title: "Nike Air Max 270 React ENG",
    price: 299.43,
    oldPrice: 534.33,
    discount: "24% Off",
    rating: 4,
    reviews: 12,
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/air-force-1-07-shoes-WrLlWX.png",
  },
  {
    id: "2",
    title: "Nike Air Zoom Pegasus 36",
    price: 299.43,
    oldPrice: 534.33,
    discount: "24% Off",
    rating: 5,
    reviews: 10,
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/5256e632-6e23-4560-b6dc-42c2323e6559/air-jordan-1-low-se-shoes-H7DD5v.png",
  },
  // Thêm dữ liệu khác...
];

// Component hiển thị sao (Fix lỗi rating: any)
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= rating ? "star" : "star-outline"}
        size={12}
        color="#FFC107" // Màu vàng
      />
    );
  }
  return <View style={{ flexDirection: "row" }}>{stars}</View>;
};

export default function SearchProduct() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Lấy từ khóa tìm kiếm từ trang Home gửi qua
  const [searchQuery, setSearchQuery] = useState(params.q?.toString() || "");

  // Render từng item (Fix lỗi item: any)
  const renderItem = ({ item }: { item: ProductType }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        // LOGIC CHUYỂN TRANG BẠN YÊU CẦU
        router.push({
          pathname: "/detail", // Chuyển sang file detail.tsx
          params: { id: item.id }    // Gửi kèm ID sản phẩm
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        
        {/* Rating Section */}
        <View style={styles.ratingContainer}>
            <StarRating rating={item.rating} />
        </View>

        <Text style={styles.price}>${item.price}</Text>
        
        <View style={styles.oldPriceContainer}>
          <Text style={styles.oldPrice}>${item.oldPrice}</Text>
          <Text style={styles.discount}>{item.discount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#40BFFF" />
            <TextInput 
                style={styles.searchInput}
                placeholder="Search Product"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>
        <TouchableOpacity style={styles.iconButton}>
             <Ionicons name="filter-outline" size={24} color="#9098B1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
             <Ionicons name="funnel-outline" size={24} color="#9098B1" />
        </TouchableOpacity>
      </View>

      <View style={styles.resultInfo}>
          <Text style={styles.resultText}>{productsData.length} Result</Text>
          <Text style={styles.resultText}>Man Shoes</Text> 
      </View>

      {/* List Products */}
      <FlatList
        data={productsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // Hiển thị 2 cột
        columnWrapperStyle={styles.row} // Style cho hàng
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EBF0FF",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#EBF0FF",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 46,
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#223263",
  },
  iconButton: {
    padding: 8,
  },
  resultInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  resultText: {
    color: '#9098B1',
    fontWeight: '700',
  },
  
  // List Styles
  listContent: {
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    width: "48%", // Để 2 item vừa khít 1 hàng có khoảng trống
    borderWidth: 1,
    borderColor: "#EBF0FF",
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 130,
    marginBottom: 8,
  },
  details: {
    alignItems: "flex-start",
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#223263",
    marginBottom: 4,
    height: 36, // Cố định chiều cao tiêu đề cho đều
  },
  ratingContainer: {
    marginBottom: 4,
  },
  price: {
    fontSize: 12,
    fontWeight: "700",
    color: "#40BFFF",
    marginBottom: 4,
  },
  oldPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  oldPrice: {
    fontSize: 10,
    color: "#9098B1",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discount: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FB7181",
  },
});