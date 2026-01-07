// app/product/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* =======================
   DATA & TYPES
======================= */
type Product = {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  image: string;
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Nike Air Max 270 React ENG",
    price: "$299.43",
    originalPrice: "$534.33",
    rating: 4.5,
    reviews: 90,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 2,
    name: "Adidas Ultraboost DNA Running",
    price: "$199.00",
    rating: 4.8,
    reviews: 120,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 3,
    name: "Puma RS-X³ Puzzle",
    price: "$150.50",
    originalPrice: "$220.00",
    rating: 4.2,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1608667508764-33cf0726b13a?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 4,
    name: "New Balance 574 Core",
    price: "$89.99",
    rating: 4.0,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 5,
    name: "Converse Chuck Taylor All Star High Top",
    price: "$65.00",
    originalPrice: "$80.00",
    rating: 4.7,
    reviews: 330,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 6,
    name: "Converse Chuck Taylor All Star High Top",
    price: "$65.00",
    originalPrice: "$80.00",
    rating: 4.7,
    reviews: 330,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 7,
    name: "Converse Chuck Taylor All Star High Top",
    price: "$65.00",
    originalPrice: "$80.00",
    rating: 4.7,
    reviews: 330,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 8,
    name: "Converse Chuck Taylor All Star High Top",
    price: "$65.00",
    originalPrice: "$80.00",
    rating: 4.7,
    reviews: 330,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=500&q=60",
  },
];

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24;

/* =======================
   MAIN COMPONENT
======================= */
export default function ProductList() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  // State quản lý hiển thị Modal Filter
  const [modalVisible, setModalVisible] = useState(false);

  // Logic tìm kiếm theo tên
  const filteredProducts = PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Render từng sản phẩm
  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      // ...existing code...
      onPress={() =>
        router.push({ pathname: "/detail", params: { id: item.id.toString() } })
      }
    // ...existing code...
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= Math.round(item.rating) ? "star" : "star-outline"}
              size={12}
              color="#FFC107"
            />
          ))}
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          )}
        </View>
        <View style={styles.reviewsWrapper}>
          <Text style={styles.reviewText}>{item.reviews} Reviews</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Daily Products",
          headerShadowVisible: false,
          headerTitleStyle: styles.headerTitleText,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />

      {/* --- THANH CÔNG CỤ (SEARCH & FILTER) --- */}
      <View style={styles.toolsContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={20} color="#40BFFF" />
          <TextInput
            placeholder="Search Product"
            placeholderTextColor="#9098B1"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        {/* Nút mở Filter Modal */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="filter-outline" size={24} color="#40BFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="funnel-outline" size={24} color="#9098B1" />
        </TouchableOpacity>
      </View>

      {/* --- TIÊU ĐỀ SECTION --- */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>List Product</Text>
        <Text style={styles.resultCount}>{filteredProducts.length} items</Text>
      </View>

      {/* --- DANH SÁCH SẢN PHẨM --- */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={50} color="#EBF0FF" />
            <Text style={styles.emptyText}>Product Not Found</Text>
          </View>
        }
      />

      {/* --- MODAL FILTER (Lấy từ code mẫu của bạn) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Search</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#223263" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

              {/* Filter: Price Range */}
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceInputs}>
                <TextInput style={styles.priceInput} placeholder="$1.00" placeholderTextColor="#9098B1" keyboardType="numeric" />
                <Text style={{ color: '#9098B1' }}> - </Text>
                <TextInput style={styles.priceInput} placeholder="$1000" placeholderTextColor="#9098B1" keyboardType="numeric" />
              </View>

              {/* Filter: Condition */}
              <Text style={styles.filterSectionTitle}>Condition</Text>
              <View style={styles.chipContainer}>
                {['New', 'Used', 'Not Specified'].map((chip, index) => (
                  <TouchableOpacity key={index} style={[styles.chip, index === 0 && styles.chipActive]}>
                    <Text style={[styles.chipText, index === 0 && styles.chipTextActive]}>{chip}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Filter: Buying Format */}
              <Text style={styles.filterSectionTitle}>Buying Format</Text>
              <View style={styles.chipContainer}>
                {['All Listings', 'Accept Offers', 'Auction', 'Buy It Now'].map((chip, index) => (
                  <TouchableOpacity key={index} style={[styles.chip, index === 3 && styles.chipActive]}>
                    <Text style={[styles.chipText, index === 3 && styles.chipTextActive]}>{chip}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Filter: Item Location */}
              <Text style={styles.filterSectionTitle}>Item Location</Text>
              <View style={styles.chipContainer}>
                {['US Only', 'North America', 'Europe', 'Asia'].map((chip, index) => (
                  <TouchableOpacity key={index} style={[styles.chip, index === 0 && styles.chipActive]}>
                    <Text style={[styles.chipText, index === 0 && styles.chipTextActive]}>{chip}</Text>
                  </TouchableOpacity>
                ))}
              </View>

            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#223263",
  },

  // --- Tool Bar ---
  toolsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EBF0FF",
  },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EBF0FF",
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 46,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#223263",
  },
  iconButton: {
    padding: 8,
  },

  // --- Section Header ---
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#223263' },
  resultCount: { fontSize: 14, fontWeight: '700', color: '#40BFFF' },

  // --- List & Card ---
  listContainer: { paddingHorizontal: 16, paddingBottom: 30 },
  columnWrapper: { justifyContent: "space-between" },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EBF0FF",
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    height: 140,
    backgroundColor: "#F6F6F6",
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: { width: "100%", height: "100%", resizeMode: "cover" },
  cardContent: { padding: 12 },
  cardTitle: {
    fontSize: 14, fontWeight: "700", color: "#223263",
    marginBottom: 8, minHeight: 36, lineHeight: 18,
  },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  priceContainer: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  currentPrice: { fontSize: 14, fontWeight: "700", color: "#40BFFF", marginRight: 8 },
  originalPrice: { fontSize: 10, color: "#9098B1", textDecorationLine: "line-through" },
  reviewsWrapper: { marginTop: 2 },
  reviewText: { fontSize: 10, color: "#9098B1", fontWeight: '500' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { marginTop: 10, fontSize: 16, color: "#9098B1" },

  // --- MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBF0FF',
    paddingBottom: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#223263' },
  filterSectionTitle: {
    fontSize: 14, fontWeight: '700', color: '#223263', marginTop: 16, marginBottom: 12,
  },
  priceInputs: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  priceInput: {
    borderWidth: 1, borderColor: '#EBF0FF', borderRadius: 5,
    padding: 12, width: '45%', color: '#223263', textAlign: 'center',
  },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 5,
    borderWidth: 1, borderColor: '#EBF0FF', marginRight: 8, marginBottom: 8,
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: 'rgba(64, 191, 255, 0.1)', borderColor: '#40BFFF',
  },
  chipText: { color: '#9098B1', fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: '#40BFFF' },
  modalFooter: { marginTop: 20 },
  applyButton: {
    backgroundColor: '#40BFFF', padding: 16, borderRadius: 5, alignItems: 'center',
  },
  applyButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});