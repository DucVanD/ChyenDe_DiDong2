import { useRouter, useLocalSearchParams } from "expo-router";
import { getProductById, getRelatedProducts, Product } from "@/services/product.service";
import { addToCart } from "@/services/cart.service";
import { showAlert } from "@/utils/alert";
import Skeleton from "@/app/components/common/Skeleton";
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

// Dữ liệu giả lập
const SIZES = [6, 6.5, 7, 7.5, 8, 8.5];
const COLORS = ["#FFC833", "#40BFFF", "#FB7181", "#53D1B6", "#5C61F4", "#223263"];

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const productId = Number(id);

  const router = useRouter();
  const { width } = useWindowDimensions();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const [selectedSize, setSelectedSize] = useState(6.5);
  const [selectedColor, setSelectedColor] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);

        // Lấy sản phẩm liên quan
        const related = await getRelatedProducts(productId, data.categoryId);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [productId]);

  const onScroll = (event: any) => {
    const slide = Math.ceil(
      event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
    );
    if (slide !== activeSlide) {
      setActiveSlide(slide);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAddingToCart(true);
    try {
      const result = await addToCart(
        {
          id: product.id,
          name: product.name,
          salePrice: product.salePrice,
          discountPrice: product.discountPrice,
          image: product.image || '',
          stock: product.qty,
        },
        quantity
      );

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showAlert('Thành công', result.message, [
          {
            text: 'Tiếp tục mua',
            style: 'cancel',
          },
          {
            text: 'Xem giỏ hàng',
            onPress: () => router.push('/(main)/cart'),
          },
        ]);
      } else {
        showAlert('Thông báo', result.message);
      }
    } catch (error) {
      showAlert('Lỗi', 'Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setAddingToCart(false);
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

  if (loading || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width="60%" height={24} style={{ marginLeft: 16 }} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Skeleton width="100%" height={width} />
          <View style={{ padding: 16 }}>
            <Skeleton width="80%" height={24} borderRadius={4} />
            <Skeleton width="40%" height={20} style={{ marginTop: 12 }} />
            <View style={{ height: 100, marginTop: 24 }}>
              <Skeleton width="100%" height={80} borderRadius={8} />
            </View>
            <Skeleton width="100%" height={100} style={{ marginTop: 24 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Không tìm thấy sản phẩm</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#40BFFF' }}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <TouchableOpacity onPress={() => router.push("/searchProduct")}>
            <Ionicons name="search-outline" size={24} color="#9098B1" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#9098B1" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 1. SLIDER ẢNH (FULL WIDTH) - Hiện tại backend chỉ có 1 ảnh */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            <Image
              source={{ uri: product.image }}
              style={[styles.productImage, { width: width }]}
            />
          </ScrollView>
        </View>

        {/* 2. PHẦN THÔNG TIN */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Text style={styles.productName}>{product.name}</Text>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={24} color="#9098B1" />
            </TouchableOpacity>
          </View>

          <View style={styles.ratingContainer}>
            {renderStars(4)}
          </View>

          <Text style={styles.price}>
            {product.discountPrice
              ? product.discountPrice.toLocaleString('vi-VN')
              : product.salePrice.toLocaleString('vi-VN')}đ
          </Text>
        </View>

        {/* SELECT SIZE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn Size</Text>
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
          <Text style={styles.sectionTitle}>Chọn màu</Text>
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

        {/* QUANTITY SELECTOR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Số lượng</Text>
          <View style={styles.quantityWrapper}>
            <TouchableOpacity
              style={styles.qtyActionBtn}
              onPress={() => {
                Haptics.selectionAsync();
                setQuantity(Math.max(1, quantity - 1));
              }}
            >
              <Ionicons name="remove" size={20} color="#9098B1" />
            </TouchableOpacity>

            <View style={styles.qtyDisplay}>
              <Text style={styles.qtyDisplayText}>{quantity}</Text>
            </View>

            <TouchableOpacity
              style={styles.qtyActionBtn}
              onPress={() => {
                Haptics.selectionAsync();
                setQuantity(Math.min(product.qty, quantity + 1));
              }}
            >
              <Ionicons name="add" size={20} color="#40BFFF" />
            </TouchableOpacity>

            <Text style={styles.stockText}>Kho: {product.qty}</Text>
          </View>
        </View>

        {/* SPECIFICATION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>
          <Text style={styles.descriptionText}>
            {product.description}
          </Text>
          {product.detail && (
            <Text style={[styles.descriptionText, { marginTop: 12 }]}>
              {product.detail}
            </Text>
          )}
        </View>

        {/* SUGGESTED */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm liên quan</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 10 }}>
            {relatedProducts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.suggestCard}
                onPress={() => router.push({
                  pathname: "/detail",
                  params: { id: item.id }
                })}
              >
                <Image source={{ uri: item.image }} style={styles.suggestImg} />
                <Text style={styles.suggestName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.suggestPrice}>
                  {item.discountPrice
                    ? item.discountPrice.toLocaleString('vi-VN')
                    : item.salePrice.toLocaleString('vi-VN')}đ
                </Text>
                {item.discountPrice && (
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Text style={styles.suggestOldPrice}>{item.salePrice.toLocaleString('vi-VN')}đ</Text>
                    <Text style={styles.suggestOff}>
                      {Math.round((1 - item.discountPrice / item.salePrice) * 100)}% Giảm
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addToCartBtn, addingToCart && styles.addToCartBtnDisabled]}
          onPress={handleAddToCart}
          disabled={addingToCart || !product}
        >
          {addingToCart ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
          )}
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
  qtyText: {
    fontSize: 12,
    color: "#223263",
  },

  // New Quantity Selector Styles
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EBF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyDisplay: {
    minWidth: 40,
    alignItems: 'center',
  },
  qtyDisplayText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#223263',
  },
  stockText: {
    fontSize: 12,
    color: '#9098B1',
    marginLeft: 8,
  },
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
  addToCartBtnDisabled: {
    backgroundColor: '#9098B1',
    opacity: 0.6,
  },
  addToCartText: { fontSize: 14, fontWeight: "700", color: "#fff" }
});