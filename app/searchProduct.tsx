import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  StatusBar,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// 1. Dữ liệu mẫu (Dummy Data) mô phỏng theo hình ảnh
const productsData = [
  {
    id: '1',
    name: 'Nike Air Max 270 React ENG',
    image: { uri: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-665455a5-45de-40fb-945f-c1852b82400d/air-zoom-pegasus-37-running-shoe-mwrTCc.jpg' },
    price: '$299,43',
    oldPrice: '$534,33',
    discount: '24% Off',
    rating: 4,
  },
  {
    id: '2',
    name: 'Nike Air Max 270 React ENG',
    image: { uri: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-512bfa8a-01a0-4971-bd34-9ef68fb6b7fa/air-zoom-pegasus-37-running-shoe-mwrTCc.jpg' },
    price: '$299,43',
    oldPrice: '$534,33',
    discount: '24% Off',
    rating: 5,
  },
  {
    id: '3',
    name: 'Nike Air Max 270 React ENG',
    image: { uri: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-33e6ae76-7489-4b2e-9d22-1d5757d47226/air-zoom-pegasus-37-running-shoe-mwrTCc.jpg' },
    price: '$299,43',
    oldPrice: '$534,33',
    discount: '24% Off',
    rating: 4,
  },
  {
    id: '4',
    name: 'Nike Air Max 270 React ENG',
    image: { uri: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-665455a5-45de-40fb-945f-c1852b82400d/air-zoom-pegasus-37-running-shoe-mwrTCc.jpg' },
    price: '$299,43',
    oldPrice: '$534,33',
    discount: '24% Off',
    rating: 5,
  },
  {
    id: '5',
    name: 'Nike Air Max 270 React ENG',
    image: { uri: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-512bfa8a-01a0-4971-bd34-9ef68fb6b7fa/air-zoom-pegasus-37-running-shoe-mwrTCc.jpg' },
    price: '$299,43',
    oldPrice: '$534,33',
    discount: '24% Off',
    rating: 4,
  },
  {
    id: '6',
    name: 'Nike Air Max 270 React ENG',
    image: { uri: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-33e6ae76-7489-4b2e-9d22-1d5757d47226/air-zoom-pegasus-37-running-shoe-mwrTCc.jpg' },
    price: '$299,43',
    oldPrice: '$534,33',
    discount: '24% Off',
    rating: 5,
  },
];

// Component hiển thị sao (Rating)
const StarRating = ({ rating }) => {
  return (
    <View style={{ flexDirection: 'row', marginTop: 4 }}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Ionicons
          key={item}
          name={item <= rating ? 'star' : 'star-outline'}
          size={12}
          color="#FFC833" // Màu vàng
        />
      ))}
    </View>
  );
};

const SearchProduct = () => {
  const router = useRouter();
  // State quản lý hiển thị Modal Filter
  const [modalVisible, setModalVisible] = useState(false);

  // Render từng sản phẩm
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card}>
        <Image source={item.image} style={styles.productImage} resizeMode="contain" />
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <StarRating rating={item.rating} />
        <Text style={styles.price}>{item.price}</Text>
        <View style={styles.discountContainer}>
          <Text style={styles.oldPrice}>{item.oldPrice}</Text>
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* 1. Header Search Area */}
      <View style={styles.headerContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#40BFFF" style={{ marginRight: 8 }} />
          <TextInput 
            placeholder="Nike Air Max" 
            style={styles.searchInput}
            placeholderTextColor="#9098B1"
          />
        </View>
        <TouchableOpacity style={styles.iconButton}>
             <Ionicons name="swap-vertical-outline" size={24} color="#9098B1" />
        </TouchableOpacity>
        
        {/* Nút bấm mở Filter */}
        <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setModalVisible(true)}
        >
             <Ionicons name="filter" size={24} color="#40BFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* 2. Sub Header (Results Count & Sort) */}
      <View style={styles.subHeader}>
        <Text style={styles.resultText}>{productsData.length} Result</Text>
        <TouchableOpacity style={styles.sortDropdown}>
          <Text style={styles.sortText}>Man Shoes</Text>
          <Ionicons name="chevron-down" size={20} color="#223263" />
        </TouchableOpacity>
      </View>

      {/* 3. Product Grid List */}
      <FlatList
        data={productsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // Hiển thị 2 cột
        columnWrapperStyle={styles.columnWrapper} // Style cho hàng
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* --- PHẦN FILTER ĐƯỢC CHẾ RA (MODAL) --- */}
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
              
              {/* Filter Section: Price Range */}
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceInputs}>
                <TextInput style={styles.priceInput} placeholder="$1.00" keyboardType="numeric" />
                <Text style={{color: '#9098B1'}}> - </Text>
                <TextInput style={styles.priceInput} placeholder="$1000" keyboardType="numeric" />
              </View>

              {/* Filter Section: Condition */}
              <Text style={styles.sectionTitle}>Condition</Text>
              <View style={styles.chipContainer}>
                {['New', 'Used', 'Not Specified'].map((chip, index) => (
                    <TouchableOpacity key={index} style={[styles.chip, index === 0 && styles.chipActive]}>
                        <Text style={[styles.chipText, index === 0 && styles.chipTextActive]}>{chip}</Text>
                    </TouchableOpacity>
                ))}
              </View>

              {/* Filter Section: Buying Format */}
              <Text style={styles.sectionTitle}>Buying Format</Text>
              <View style={styles.chipContainer}>
                {['All Listings', 'Accept Offers', 'Auction', 'Buy It Now'].map((chip, index) => (
                    <TouchableOpacity key={index} style={[styles.chip, index === 3 && styles.chipActive]}>
                        <Text style={[styles.chipText, index === 3 && styles.chipTextActive]}>{chip}</Text>
                    </TouchableOpacity>
                ))}
              </View>

              {/* Filter Section: Item Location */}
              <Text style={styles.sectionTitle}>Item Location</Text>
              <View style={styles.chipContainer}>
                 {['US Only', 'North America', 'Europe', 'Asia'].map((chip, index) => (
                    <TouchableOpacity key={index} style={[styles.chip, index === 0 && styles.chipActive]}>
                        <Text style={[styles.chipText, index === 0 && styles.chipTextActive]}>{chip}</Text>
                    </TouchableOpacity>
                ))}
              </View>

            </ScrollView>

            {/* Modal Footer: Apply Button */}
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
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  
  // Header Styles
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBF0FF',
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 46,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#223263',
  },
  iconButton: {
    padding: 5,
    marginLeft: 4,
  },
  divider: { height: 1, backgroundColor: '#EBF0FF' },

  // Sub Header
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultText: {
    color: '#9098B1',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sortDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    color: '#223263',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 8,
  },

  // List Styles
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Đẩy 2 cột ra 2 bên
  },
  
  // Card Styles
  card: {
    width: '48%', // Chiếm gần 1 nửa màn hình để tạo 2 cột
    borderWidth: 1,
    borderColor: '#EBF0FF',
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  productImage: {
    width: '100%',
    height: 100,
    marginBottom: 8,
    borderRadius: 5,
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#223263',
    height: 36, // Giới hạn chiều cao cho 2 dòng
    marginBottom: 4,
  },
  price: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#40BFFF',
    marginTop: 8,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  oldPrice: {
    fontSize: 10,
    color: '#9098B1',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FB7181', // Màu đỏ giảm giá
  },

  // --- Modal Styles (Filter) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end', // Hiển thị từ dưới lên
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '80%', // Chiếm 80% chiều cao màn hình
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
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#223263',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#223263',
    marginTop: 16,
    marginBottom: 12,
  },
  
  // Filter Inputs
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#EBF0FF',
    borderRadius: 5,
    padding: 12,
    width: '45%',
    color: '#9098B1',
    textAlign: 'center',
  },
  
  // Chips
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#EBF0FF',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: 'rgba(64, 191, 255, 0.1)', // Màu xanh nhạt
    borderColor: '#40BFFF',
  },
  chipText: {
    color: '#9098B1',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chipTextActive: {
    color: '#40BFFF',
  },

  // Modal Footer
  modalFooter: {
    marginTop: 20,
  },
  applyButton: {
    backgroundColor: '#40BFFF',
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SearchProduct;