import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";

// Dữ liệu giả lập
const SIZES = [6, 6.5, 7, 7.5, 8, 8.5];
const COLORS = ["#FFC833", "#40BFFF", "#FB7181", "#53D1B6", "#5C61F4", "#223263"];
const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", // Đỏ
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80", // Xanh
  "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=800&q=80", // Đen
];

const SUGGESTED_PRODUCTS = [
  { id: 1, name: "FS - Nike Air Max 270 React...", price: "$299,43", oldPrice: "$534,33", off: "24% Off", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" },
  { id: 2, name: "FS - QUILTED MAXI CROSS...", price: "$299,43", oldPrice: "$534,33", off: "24% Off", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa" },
  { id: 3, name: "FS - Nike Air Max 270 React...", price: "$299,43", oldPrice: "$534,33", off: "24% Off", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" },
];

export default function ProductDetail() {
  const { id } = useLocalSearchParams(); 
  
  console.log("Product ID:", id);
  const router = useRouter();
  const { width } = useWindowDimensions(); // Lấy chiều rộng màn hình động
  const [selectedSize, setSelectedSize] = useState(6.5);
  const [selectedColor, setSelectedColor] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);

  // Xử lý sự kiện scroll ảnh
  const onScroll = (event: any) => {
    const slide = Math.ceil(
      event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
    );
    if (slide !== activeSlide) {
      setActiveSlide(slide);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#FFC833" : "#EBF0FF"}
        />
      );
    }
    return <View style={{ flexDirection: "row" }}>{stars}</View>;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Nike Air Zoom Pegasus...
        </Text>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <TouchableOpacity>
            <Ionicons name="search-outline" size={24} color="#9098B1" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#9098B1" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. SLIDER ẢNH (FULL WIDTH) - Không nằm trong View có padding */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {PRODUCT_IMAGES.map((img, index) => (
              <Image 
                key={index} 
                source={{ uri: img }} 
                // Quan trọng: Gán width bằng width màn hình tại đây
                style={[styles.productImage, { width: width }]} 
              />
            ))}
          </ScrollView>
          {/* Dots */}
          <View style={styles.dotsContainer}>
            {PRODUCT_IMAGES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, activeSlide === i ? styles.activeDot : styles.inactiveDot]}
              />
            ))}
          </View>
        </View>

        {/* 2. PHẦN THÔNG TIN (CÓ PADDING) */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Text style={styles.productName}>Nike Air Zoom Pegasus 36 Miami</Text>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={24} color="#9098B1" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.ratingContainer}>
            {renderStars(4)}
          </View>

          <Text style={styles.price}>$299,43</Text>
        </View>

        {/* SELECT SIZE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Size</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
            {SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(size)}
                style={[styles.sizeCircle, selectedSize === size && styles.selectedSizeCircle]}
              >
                <Text style={[styles.sizeText, selectedSize === size && styles.selectedSizeText]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SELECT COLOR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
            {COLORS.map((color, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedColor(index)}
                style={[styles.colorCircle, { backgroundColor: color }]}
              >
                {selectedColor === index && <View style={styles.colorSelectedDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SPECIFICATION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specification</Text>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Shown:</Text>
            <Text style={styles.specValue}>Laser Blue/Anthracite/Watermelon/White</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Style:</Text>
            <Text style={styles.specValue}>CD0113-400</Text>
          </View>
          <Text style={styles.descriptionText}>
            The Nike Air Max 270 React ENG combines a full-length React foam midsole with a 270 Max Air unit for unrivaled comfort and a striking visual experience.
          </Text>
        </View>

        {/* REVIEW */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.sectionTitle}>Review Product</Text>
            <TouchableOpacity>
              <Text style={styles.seeMore}>See More</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
             {renderStars(4.5)}
             <Text style={styles.ratingCount}>4.5 (5 Review)</Text>
          </View>
          
          <View style={styles.reviewItem}>
             <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Image 
                  source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }} 
                  style={styles.avatar} 
                />
                <View>
                    <Text style={styles.reviewerName}>James Lawson</Text>
                    {renderStars(4)}
                </View>
             </View>
             <Text style={styles.reviewText}>
                air max are always very comfortable fit, clean and just perfect in every way.
             </Text>
             <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                 <Image source={{uri: PRODUCT_IMAGES[0]}} style={styles.reviewImage} />
                 <Image source={{uri: PRODUCT_IMAGES[1]}} style={styles.reviewImage} />
                 <Image source={{uri: PRODUCT_IMAGES[2]}} style={styles.reviewImage} />
             </View>
             <Text style={styles.reviewDate}>December 10, 2016</Text>
          </View>
        </View>

        {/* SUGGESTED */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You Might Also Like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 10 }}>
            {SUGGESTED_PRODUCTS.map((item) => (
                <View key={item.id} style={styles.suggestCard}>
                   <Image source={{uri: item.img}} style={styles.suggestImg} />
                   <Text style={styles.suggestName} numberOfLines={2}>{item.name}</Text>
                   <Text style={styles.suggestPrice}>{item.price}</Text>
                   <View style={{flexDirection: 'row', gap: 8}}>
                       <Text style={styles.suggestOldPrice}>{item.oldPrice}</Text>
                       <Text style={styles.suggestOff}>{item.off}</Text>
                   </View>
                </View>
            ))}
          </ScrollView>
        </View>

      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
          <TouchableOpacity style={styles.addToCartBtn}>
             <Text style={styles.addToCartText}>Add To Cart</Text>
          </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // LƯU Ý: Không được có padding ở đây để ảnh tràn viền
  },
  scrollContent: {
    paddingBottom: 100,
  },
  
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16, // Padding riêng cho header
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EBF0FF",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#223263",
    flex: 1,
    marginLeft: 12,
  },

  // Image Slider
  productImage: {
    // width sẽ được set động trong code
    height: 280, // Tăng chiều cao lên cho thoáng
    resizeMode: "cover",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: { backgroundColor: "#40BFFF" },
  inactiveDot: { backgroundColor: "#EBF0FF" },

  // Section chung (Dùng để bọc các phần nội dung có lề)
  section: {
    paddingHorizontal: 16, // Lề trái phải cho nội dung
    marginTop: 24, // Khoảng cách giữa các mục
  },

  productName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#223263",
    width: "80%",
    marginBottom: 8,
  },
  ratingContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#40BFFF",
  },

  // Size Selector
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#223263",
    marginBottom: 12,
  },
  sizeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#EBF0FF",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedSizeCircle: {
    borderColor: "#40BFFF",
  },
  sizeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#223263",
  },
  selectedSizeText: {
    color: "#40BFFF",
  },

  // Color Selector
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  colorSelectedDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  // Specs
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  specLabel: { fontSize: 12, color: "#223263", flex: 1 },
  specValue: { fontSize: 12, color: "#9098B1", flex: 2, textAlign: 'right' },
  descriptionText: {
    fontSize: 12,
    color: "#9098B1",
    lineHeight: 21.6,
    marginTop: 4,
  },

  // Review
  seeMore: { fontSize: 14, fontWeight: "700", color: "#40BFFF" },
  ratingCount: { fontSize: 10, color: "#9098B1", marginLeft: 8, fontWeight: "400" },
  reviewItem: { marginTop: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 16 },
  reviewerName: { fontSize: 14, fontWeight: "700", color: "#223263", marginBottom: 4 },
  reviewText: { fontSize: 12, color: "#9098B1", lineHeight: 21.6 },
  reviewImage: { width: 72, height: 72, borderRadius: 8, marginTop: 10 },
  reviewDate: { fontSize: 10, color: "#9098B1", marginTop: 16 },

  // Suggest
  suggestCard: {
      width: 141,
      borderWidth: 1,
      borderColor: "#EBF0FF",
      borderRadius: 5,
      padding: 16,
      backgroundColor: "#fff"
  },
  suggestImg: { width: 109, height: 109, borderRadius: 5, marginBottom: 8, alignSelf: 'center' },
  suggestName: { fontSize: 12, fontWeight: "700", color: "#223263", marginBottom: 4, height: 36 },
  suggestPrice: { fontSize: 12, fontWeight: "700", color: "#40BFFF", marginBottom: 4 },
  suggestOldPrice: { fontSize: 10, textDecorationLine: "line-through", color: "#9098B1" },
  suggestOff: { fontSize: 10, fontWeight: "700", color: "#FB7181" },

  // Footer
  footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#EBF0FF'
  },
  addToCartBtn: {
      backgroundColor: '#40BFFF',
      borderRadius: 5,
      height: 57,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#40BFFF",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.24,
      shadowRadius: 20,
      elevation: 5
  },
  addToCartText: { fontSize: 14, fontWeight: "700", color: "#fff" }
});