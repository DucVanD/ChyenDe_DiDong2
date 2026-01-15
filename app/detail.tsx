import { useRouter, useLocalSearchParams } from "expo-router";
import { getProductById, getRelatedProducts, Product } from "@/services/product.service";
import { getCategoryById, Category } from "@/services/category.service";
import { addToCart } from "@/services/cart.service";
import { showToast } from "@/app/components/common/Toast";
import Skeleton from "@/app/components/common/Skeleton";
import DiscountBadge from "./components/common/DiscountBadge";
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
import { Colors, Spacing, BorderRadius, Typography, Shadows } from "@/constants/theme";
import { Button } from "@/app/components/common/Button";

const { width } = Dimensions.get("window");

const SIZE_CONFIG = {
  CLOTHING: {
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    default: 'M',
    metrics: ['Size', 'Chiều cao (cm)', 'Cân nặng (kg)'],
    data: [
      ['S', '150 - 160', '42 - 50'],
      ['M', '160 - 167', '50 - 58'],
      ['L', '167 - 173', '58 - 66'],
      ['XL', '173 - 180', '66 - 75'],
      ['XXL', '180 - 185', '75 - 85'],
    ],
    suggestion: (h: string, w: string, s: string) => `Người mẫu cao ${h} - ${w}, mặc size ${s} (Vừa vặn)`,
  },
  SHOES: {
    sizes: ['38', '39', '40', '41', '42'],
    default: '40',
    metrics: ['Size (EU)', 'Chiều dài chân (cm)', 'Chiều rộng (cm)'],
    data: [
      ['38', '23.5 - 24.0', '8.5 - 9.0'],
      ['39', '24.1 - 24.5', '9.1 - 9.5'],
      ['40', '24.6 - 25.0', '9.6 - 10.0'],
      ['41', '25.1 - 25.5', '10.1 - 10.5'],
      ['42', '25.6 - 26.0', '10.6 - 11.0'],
    ],
    suggestion: (h: string, w: string, s: string) => `Người mẫu cao ${h}, đi size ${s} (Thoải mái)`,
  }
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const productId = Number(id);

  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const [selectedSize, setSelectedSize] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [sizeGuideType, setSizeGuideType] = useState<'CLOTHING' | 'SHOES'>('CLOTHING');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);

        // Fetch category to determine size system
        try {
          const cat = await getCategoryById(data.categoryId);
          setCategory(cat);

          // Logic: Check category name or slug to switch size guide
          const catNameLower = cat.name.toLowerCase();
          if (catNameLower.includes('giày') || catNameLower.includes('dép') || catNameLower.includes('shoe')) {
            setSizeGuideType('SHOES');
            setSelectedSize(SIZE_CONFIG.SHOES.default);
          } else {
            setSizeGuideType('CLOTHING');
            setSelectedSize(SIZE_CONFIG.CLOTHING.default);
          }
        } catch (catErr) {
          console.error("Lỗi khi tải thông tin danh mục:", catErr);
        }

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
        showToast({
          message: 'Đã thêm vào giỏ hàng!',
          type: 'success',
        });
      } else {
        showToast({
          message: result.message,
          type: 'warning',
        });
      }
    } catch (error) {
      showToast({
        message: 'Có lỗi xảy ra khi thêm vào giỏ hàng',
        type: 'error',
      });
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
          <Skeleton width="100%" height={width * 0.8} />
          <View style={{ padding: Spacing.base }}>
            <Skeleton width="80%" height={28} borderRadius={4} />
            <Skeleton width="40%" height={24} style={{ marginTop: 12 }} />
            <View style={{ height: 100, marginTop: Spacing.xl }}>
              <Skeleton width="100%" height={80} borderRadius={BorderRadius.lg} />
            </View>
            <Skeleton width="100%" height={120} style={{ marginTop: Spacing.xl }} />
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
        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
          style={{ padding: 4 }}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.neutral.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={{ flexDirection: "row", gap: Spacing.base }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              router.push("/searchProduct");
            }}
          >
            <Ionicons name="search-outline" size={24} color={Colors.neutral.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color={Colors.neutral.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* MAIN SCROLLABLE CONTENT */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >

        {/* 1. SLIDER ẢNH - Tối ưu kích thước và hiển thị */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="contain"
            />
          </ScrollView>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            <View style={[styles.dot, activeSlide === 0 && styles.dotActive]} />
          </View>

          {/* Premium Animated Discount Badge */}
          {product.discountPrice && product.discountPrice < product.salePrice && (
            <DiscountBadge
              discount={(1 - product.discountPrice / product.salePrice) * 100}
              size="lg"
            />
          )}
        </View>

        {/* 2. PHẦN THÔNG TIN CỐT LÕI */}
        <View style={styles.section}>
          <View style={styles.statusBadgeRow}>
            <View style={[styles.statusBadge, { backgroundColor: product.qty > 5 ? Colors.accent.success + '20' : Colors.accent.error + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: product.qty > 5 ? Colors.accent.success : Colors.accent.error }]} />
              <Text style={[styles.statusText, { color: product.qty > 5 ? Colors.accent.success : Colors.accent.error }]}>
                {product.qty > 5 ? "Còn hàng" : `Chỉ còn ${product.qty} sản phẩm`}
              </Text>
            </View>
            <TouchableOpacity style={styles.shareBtn}>
              <Ionicons name="share-social-outline" size={20} color={Colors.neutral.text.secondary} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 12 }}>
            <Text style={styles.productName}>{product.name}</Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons name="heart-outline" size={26} color={Colors.neutral.text.tertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.starsRow}>
              {renderStars(4)}
              <Text style={styles.ratingText}>4.8</Text>
            </View>
            <View style={styles.verticalDivider} />
            <Text style={styles.soldText}>Đã bán 1.2k+</Text>
          </View>

          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                {product.discountPrice
                  ? product.discountPrice.toLocaleString('vi-VN')
                  : product.salePrice.toLocaleString('vi-VN')}đ
              </Text>
              {product.discountPrice && product.discountPrice < product.salePrice && (
                <Text style={styles.oldPrice}>
                  {product.salePrice.toLocaleString('vi-VN')}đ
                </Text>
              )}
            </View>
            {product.discountPrice && (
              <View style={styles.saveBadge}>
                <Text style={styles.saveText}>Tiết kiệm {(product.salePrice - product.discountPrice).toLocaleString('vi-VN')}đ</Text>
              </View>
            )}
          </View>
        </View>

        {/* 3. KEY SELLING POINTS (Lý do mua hàng) */}
        <View style={[styles.section, styles.keyPointsContainer]}>
          <View style={styles.keyPointItem}>
            <Ionicons name="checkmark-circle" size={18} color={Colors.primary.main} />
            <Text style={styles.keyPointText}>Thiết kế Slim-fit tôn dáng, dễ phối đồ</Text>
          </View>
          <View style={styles.keyPointItem}>
            <Ionicons name="checkmark-circle" size={18} color={Colors.primary.main} />
            <Text style={styles.keyPointText}>Chất liệu Cotton 100% thoáng mát, thấm hút</Text>
          </View>
          <View style={styles.keyPointItem}>
            <Ionicons name="checkmark-circle" size={18} color={Colors.primary.main} />
            <Text style={styles.keyPointText}>Phù hợp mặc đi làm, đi chơi hoặc dạo phố</Text>
          </View>
        </View>

        {/* SELECT SIZE */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Chọn Size</Text>
            <TouchableOpacity onPress={() => setShowSizeGuide(true)}>
              <Text style={styles.sizeGuideLink}>Xem bảng size 📏</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
            {SIZE_CONFIG[sizeGuideType].sizes.map((size) => (
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
          <View style={styles.modelSuggestion}>
            <Ionicons name="body-outline" size={14} color={Colors.neutral.text.tertiary} />
            <Text style={styles.modelSuggestionText}>
              {sizeGuideType === 'CLOTHING'
                ? SIZE_CONFIG.CLOTHING.suggestion('1m70', '64kg', selectedSize)
                : SIZE_CONFIG.SHOES.suggestion('1m70', '65kg', selectedSize)}
            </Text>
          </View>
        </View>


        {/* 4. TECHNICAL INFO (Thông số kỹ thuật) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
          <View style={styles.techInfoContainer}>
            <View style={styles.techRow}>
              <Text style={styles.techLabel}>Chất liệu</Text>
              <Text style={styles.techValue}>Cotton pha (Sợi tự nhiên)</Text>
            </View>
            <View style={styles.techRow}>
              <Text style={styles.techLabel}>Độ dày</Text>
              <Text style={styles.techValue}>Trung bình</Text>
            </View>
            <View style={styles.techRow}>
              <Text style={styles.techLabel}>Co giãn</Text>
              <Text style={styles.techValue}>Co giãn nhẹ 2 chiều</Text>
            </View>
            <View style={styles.techRow}>
              <Text style={styles.techLabel}>Phong cách</Text>
              <Text style={styles.techValue}>Casual / Smart Casual</Text>
            </View>
          </View>
        </View>

        {/* 5. PURCHASE POLICIES (Chính sách tin cậy) */}
        <View style={[styles.section, styles.policyContainer]}>
          <View style={styles.policyItem}>
            <View style={styles.policyIconBox}>
              <Ionicons name="flash-outline" size={20} color={Colors.primary.main} />
            </View>
            <Text style={styles.policyText}>Giao nhanh 2h-48h</Text>
          </View>
          <View style={styles.policyItem}>
            <View style={styles.policyIconBox}>
              <Ionicons name="refresh-outline" size={20} color={Colors.primary.main} />
            </View>
            <Text style={styles.policyText}>Đổi trả trong 7 ngày</Text>
          </View>
          <View style={styles.policyItem}>
            <View style={styles.policyIconBox}>
              <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary.main} />
            </View>
            <Text style={styles.policyText}>Bảo hành chính hãng</Text>
          </View>
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
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setQuantity(Math.min(product.qty, quantity + 1));
              }}
            >
              <Ionicons name="add" size={20} color={Colors.primary.main} />
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

        {/* 6. REVIEWS & RATINGS (Đánh giá từ khách hàng) */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Đánh giá & Nhận xét</Text>
            <TouchableOpacity>
              <Text style={styles.sizeGuideLink}>Xem tất cả (156)</Text>
            </TouchableOpacity>
          </View>

          {/* Review Card 1 */}
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?u=user1' }}
                style={styles.reviewAvatar}
              />
              <View style={styles.reviewUserInfo}>
                <Text style={styles.reviewUserName}>Nguyễn Văn A</Text>
                <View style={styles.reviewStarsRow}>
                  {renderStars(5)}
                  <Text style={styles.reviewDate}>15/01/2026</Text>
                </View>
              </View>
            </View>
            <Text style={styles.reviewComment}>
              Áo form rất đẹp, mặc ôm vừa vặn. Chất vải cotton thoáng mát đúng như mô tả. Sẽ ủng hộ shop thêm!
            </Text>
          </View>

          {/* Review Card 2 */}
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?u=user2' }}
                style={styles.reviewAvatar}
              />
              <View style={styles.reviewUserInfo}>
                <Text style={styles.reviewUserName}>Trần Thị B</Text>
                <View style={styles.reviewStarsRow}>
                  {renderStars(4)}
                  <Text style={styles.reviewDate}>10/01/2026</Text>
                </View>
              </View>
            </View>
            <Text style={styles.reviewComment}>
              Giao hàng nhanh, đóng gói cẩn thận. Màu sắc thực tế hơi đậm hơn ảnh một xíu nhưng vẫn rất ưng ý.
            </Text>
          </View>
        </View>

        {/* SUGGESTED */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm liên quan</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.base, paddingBottom: Spacing.base }}>
            {relatedProducts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.suggestCard}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push({
                    pathname: "/detail",
                    params: { id: item.id }
                  });
                }}
              >
                <View style={styles.suggestImgWrapper}>
                  <Image source={{ uri: item.image }} style={styles.suggestImg} />
                  {item.discountPrice && (
                    <DiscountBadge
                      discount={(1 - item.discountPrice / item.salePrice) * 100}
                      size="sm"
                    />
                  )}
                </View>
                <View style={styles.suggestContent}>
                  <Text style={styles.suggestName} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.suggestPriceRow}>
                    <Text style={styles.suggestPrice}>
                      {item.discountPrice
                        ? item.discountPrice.toLocaleString('vi-VN')
                        : item.salePrice.toLocaleString('vi-VN')}đ
                    </Text>
                    {item.discountPrice && (
                      <Text style={styles.suggestOldPrice}>
                        {item.salePrice.toLocaleString('vi-VN')}đ
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Button
          title="Thêm vào giỏ hàng"
          variant="primary"
          onPress={handleAddToCart}
          loading={addingToCart}
          disabled={addingToCart || !product}
          fullWidth
          size="lg"
        />
      </View>

      {/* SIZE GUIDE MODAL */}
      <View>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.modalOverlay, !showSizeGuide && { display: 'none' }]}
          onPress={() => setShowSizeGuide(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bảng hướng dẫn chọn size</Text>
              <TouchableOpacity onPress={() => setShowSizeGuide(false)}>
                <Ionicons name="close" size={24} color={Colors.neutral.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.sizeChart}>
              <View style={[styles.chartRow, styles.chartHeader]}>
                {SIZE_CONFIG[sizeGuideType].metrics.map((metric, idx) => (
                  <Text key={idx} style={styles.chartHeaderText}>{metric}</Text>
                ))}
              </View>
              {SIZE_CONFIG[sizeGuideType].data.map((row, rowIdx) => (
                <View key={rowIdx} style={[styles.chartRow, rowIdx % 2 !== 0 && { backgroundColor: Colors.neutral.bg }]}>
                  {row.map((cell, cellIdx) => (
                    <Text key={cellIdx} style={styles.chartText}>{cell}</Text>
                  ))}
                </View>
              ))}
            </View>
            <Text style={styles.modalNote}>
              {sizeGuideType === 'CLOTHING'
                ? '* Lưu ý: Nếu bạn có thể trạng đậm người hoặc thích mặc rộng, hãy nâng lên 1 size.'
                : '* Lưu ý: Với giày thể thao, bạn có thể chọn đúng size EU hoặc tăng 0.5 size nếu chân bè.'}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowSizeGuide(false)}
            >
              <Text style={styles.modalCloseBtnText}>Đã hiểu</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
    backgroundColor: Colors.neutral.white,
  },
  headerTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    flex: 1,
    marginHorizontal: Spacing.sm,
  },

  // Image Slider
  imageContainer: {
    position: 'relative',
    width: width,
    height: 380,
    backgroundColor: Colors.neutral.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: width,
    height: 340,
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.accent.error,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderBottomRightRadius: BorderRadius.lg,
    ...Shadows.md,
    zIndex: 10,
  },
  discountText: {
    fontSize: 12,
    color: Colors.neutral.white,
    fontWeight: Typography.fontWeight.bold,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: Spacing.base,
    alignSelf: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.neutral.border,
  },
  dotActive: {
    backgroundColor: Colors.primary.main,
    width: 16,
  },

  // Section chung
  section: {
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.xl,
  },

  productName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    flex: 1,
    marginRight: Spacing.base,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: Typography.fontWeight.bold,
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    marginLeft: 4,
  },
  verticalDivider: {
    width: 1,
    height: 14,
    backgroundColor: Colors.neutral.border,
    marginHorizontal: 12,
  },
  soldText: {
    fontSize: 14,
    color: Colors.neutral.text.tertiary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  priceContainer: {
    marginTop: Spacing.sm,
  },
  saveBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E7F9EF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginTop: 6,
  },
  saveText: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: Typography.fontWeight.semibold,
  },

  // Key Points
  keyPointsContainer: {
    backgroundColor: Colors.neutral.bg,
    marginHorizontal: Spacing.base,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.base,
  },
  keyPointItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  keyPointText: {
    fontSize: 13,
    color: Colors.neutral.text.secondary,
    flex: 1,
  },
  price: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
  },
  oldPrice: {
    fontSize: Typography.fontSize.base,
    color: Colors.neutral.text.tertiary,
    textDecorationLine: 'line-through',
  },

  // Selectors
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  sizeGuideLink: {
    fontSize: 12,
    color: Colors.primary.main,
    fontWeight: Typography.fontWeight.semibold,
  },
  modelSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  modelSuggestionText: {
    fontSize: 12,
    color: Colors.neutral.text.tertiary,
    fontStyle: 'italic',
  },
  sizeCircle: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.neutral.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.neutral.white,
  },
  selectedSizeCircle: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light + '30',
  },
  sizeText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.secondary,
  },
  selectedSizeText: {
    color: Colors.primary.main,
  },

  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.sm,
  },
  colorSelectedDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.neutral.white,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
  },

  // Quantity Selector
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  qtyActionBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.neutral.bg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral.border,
  },
  qtyDisplay: {
    minWidth: 40,
    alignItems: 'center',
  },
  qtyDisplayText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  stockText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.tertiary,
  },

  descriptionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.secondary,
    lineHeight: 22,
  },

  // Suggest
  suggestCard: {
    width: 160,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.neutral.white,
    ...Shadows.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral.border,
  },
  suggestImgWrapper: {
    width: '100%',
    height: 140,
    position: 'relative',
    backgroundColor: Colors.neutral.bg,
  },
  suggestImg: {
    width: '100%',
    height: '100%',
  },
  suggestBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.accent.error,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderBottomRightRadius: BorderRadius.md,
  },
  suggestBadgeText: {
    fontSize: 10,
    color: Colors.neutral.white,
    fontWeight: Typography.fontWeight.bold,
  },
  suggestContent: {
    padding: Spacing.sm,
  },
  suggestName: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral.text.primary,
    height: 36,
  },
  suggestPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
    flexWrap: 'wrap',
  },
  // Technical Info
  techInfoContainer: {
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  techRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.bg,
  },
  techLabel: {
    fontSize: 13,
    color: Colors.neutral.text.secondary,
  },
  techValue: {
    fontSize: 13,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral.text.primary,
  },

  // Policy
  policyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FBFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.primary.light + '40',
  },
  policyItem: {
    alignItems: 'center',
    flex: 1,
  },
  policyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Shadows.sm,
  },
  policyText: {
    fontSize: 10,
    color: Colors.neutral.text.secondary,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
  },
  suggestPrice: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
  },
  suggestOldPrice: {
    fontSize: 10,
    color: Colors.neutral.text.tertiary,
    textDecorationLine: 'line-through',
  },

  // Reviews
  reviewCard: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.bg,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral.bg,
  },
  reviewUserInfo: {
    marginLeft: 12,
    flex: 1,
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    marginBottom: 2,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewDate: {
    fontSize: 11,
    color: Colors.neutral.text.tertiary,
  },
  reviewComment: {
    fontSize: 13,
    color: Colors.neutral.text.secondary,
    lineHeight: 20,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.neutral.white,
    padding: Spacing.base,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.border,
    ...Shadows.lg,
  },
  // Modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.lg,
    padding: 20,
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  sizeChart: {
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: 16,
  },
  chartRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
  },
  chartHeader: {
    backgroundColor: Colors.neutral.bg,
  },
  chartHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  chartText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: Colors.neutral.text.secondary,
  },
  modalNote: {
    fontSize: 11,
    color: Colors.neutral.text.tertiary,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  modalCloseBtn: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: Colors.neutral.white,
    fontWeight: Typography.fontWeight.bold,
  },
});