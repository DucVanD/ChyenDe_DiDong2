import { getCategories } from "@/services/category.service";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  Platform,
} from "react-native";
import { filterProducts, Product, searchProducts } from "@/services/product.service";
import Skeleton from "@/app/components/common/Skeleton";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import { Button } from "@/app/components/common/Button";
import * as Haptics from 'expo-haptics';
import DiscountBadge from "@/app/components/common/DiscountBadge";
import FadeInStagger from "@/app/components/common/FadeInStagger";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24;

/* =======================
   MAIN COMPONENT
======================= */
export default function ProductList() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialQuery = params.q?.toString() || "";
  const categoryId = params.categoryId ? Number(params.categoryId) : null;

  const [searchText, setSearchText] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal Filter State
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  // Filter params
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>("newest");

  const PRICE_RANGES = [
    { label: "Dưới 500k", min: 0, max: 500000 },
    { label: "Dưới 2tr", min: 0, max: 2000000 },
    { label: "2tr - 5tr", min: 2000000, max: 5000000 },
    { label: "Trên 5tr", min: 5000000, max: 100000000 },
  ];

  const SORT_OPTIONS = [
    { label: "Mới nhất", value: "newest" },
    { label: "Giá: Thấp - Cao", value: "price_asc" },
    { label: "Giá: Cao - Thấp", value: "price_desc" },
  ];

  const fetchProducts = useCallback(async (pageNum: number, isNewSearch = false) => {
    try {
      if (isNewSearch) setLoading(true);
      else setLoadingMore(true);

      let response;
      const filterParams: any = {
        page: pageNum,
        size: 10,
        sortBy: selectedSort,
        keyword: searchText
      };

      if (selectedPriceRange !== null) {
        filterParams.minPrice = PRICE_RANGES[selectedPriceRange].min;
        filterParams.maxPrice = PRICE_RANGES[selectedPriceRange].max;
      }

      if (categoryId) {
        filterParams.categoryId = [categoryId];
      }

      response = await filterProducts(filterParams);

      if (isNewSearch) {
        setProducts(response.content);
      } else {
        setProducts(prev => [...prev, ...response.content]);
      }

      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchText, categoryId, selectedSort, selectedPriceRange]);

  useEffect(() => {
    const fetchCategoryInfo = async () => {
      if (categoryId) {
        try {
          const cats = await getCategories();
          const currentCat = cats.find(c => c.id === categoryId);
          if (currentCat) setCategoryName(currentCat.name);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin danh mục:", error);
        }
      } else {
        setCategoryName(null);
      }
    };

    fetchCategoryInfo();
    setPage(0);
    fetchProducts(0, true);
  }, [initialQuery, categoryId, selectedSort, selectedPriceRange]); // Refetch when sort or price range changes

  const handleLoadMore = () => {
    if (!loading && !loadingMore && page < totalPages - 1) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  // Render từng sản phẩm
  const renderProductItem = ({ item, index }: { item: Product, index: number }) => (
    <FadeInStagger index={index % 10} style={{ width: '48%' }}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          Haptics.selectionAsync();
          router.push({ pathname: "/detail", params: { id: item.id.toString() } });
        }}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          {item.discountPrice && item.discountPrice < item.salePrice && (
            <DiscountBadge
              discount={(1 - item.discountPrice / item.salePrice) * 100}
            />
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= 4 ? "star" : "star-outline"}
                size={12}
                color="#FFC107"
              />
            ))}
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>
              {item.discountPrice ? item.discountPrice.toLocaleString('vi-VN') : item.salePrice.toLocaleString('vi-VN')}đ
            </Text>
            <View style={styles.priceRow}>
              {item.discountPrice && (
                <Text style={styles.originalPrice}>{item.salePrice.toLocaleString('vi-VN')}đ</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </FadeInStagger>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Sản phẩm",
          headerShadowVisible: false,
          headerTitleStyle: styles.headerTitleText,
          headerStyle: { backgroundColor: Colors.neutral.white },
          headerTintColor: Colors.neutral.text.primary,
        }}
      />

      {/* --- THANH CÔNG CỤ (SEARCH & FILTER) --- */}
      <View style={styles.toolsContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={20} color={Colors.neutral.text.tertiary} />
          <TextInput
            placeholder="Bạn đang tìm gì?"
            placeholderTextColor={Colors.neutral.text.tertiary}
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => fetchProducts(0, true)}
          />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setModalVisible(true);
          }}
        >
          <Ionicons name="options-outline" size={20} color={Colors.neutral.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* --- TIÊU ĐỀ SECTION --- */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {categoryName ? `Danh mục: ${categoryName}` : (searchText ? `Kết quả cho "${searchText}"` : "Tất cả sản phẩm")}
        </Text>
        <Text style={styles.resultCount}>
          {products.length} sản phẩm
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, padding: Spacing.base }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <View key={i} style={[styles.card, { width: '48%' }]}>
                <Skeleton width="100%" height={140} borderRadius={BorderRadius.lg} />
                <View style={{ padding: Spacing.sm }}>
                  <Skeleton width="100%" height={15} />
                  <Skeleton width="60%" height={15} style={{ marginTop: 8 }} />
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color={Colors.primary.main} style={{ marginVertical: Spacing.xl }} />
            ) : <View style={{ height: Spacing.xl }} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="search-outline" size={64} color={Colors.neutral.text.tertiary} />
              </View>
              <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm</Text>
              <Text style={styles.emptyText}>Thử thay đổi từ khóa hoặc bộ lọc của bạn để có kết quả tốt hơn</Text>
              <View style={{ marginTop: Spacing.xl, width: 200 }}>
                <Button
                  title="Xóa tất cả bộ lọc"
                  variant="outline"
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedPriceRange(null);
                    setSelectedSort("newest");
                  }}
                  fullWidth
                />
              </View>
            </View>
          }
        />
      )}

      {/* --- MODAL FILTER (Lấy từ code mẫu của bạn) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeaderContent}>
                <Text style={styles.modalTitle}>Bộ lọc sản phẩm</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={Colors.neutral.text.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

              {/* Filter: Sort By */}
              <Text style={styles.filterSectionTitle}>Sắp xếp theo</Text>
              <View style={styles.chipContainer}>
                {SORT_OPTIONS.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.chip, selectedSort === option.value && styles.chipActive]}
                    onPress={() => setSelectedSort(option.value)}
                  >
                    <Text style={[styles.chipText, selectedSort === option.value && styles.chipTextActive]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Filter: Price Range */}
              <Text style={styles.filterSectionTitle}>Khoảng giá</Text>
              <View style={styles.chipContainer}>
                {PRICE_RANGES.map((range, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.chip, selectedPriceRange === index && styles.chipActive]}
                    onPress={() => setSelectedPriceRange(selectedPriceRange === index ? null : index)}
                  >
                    <Text style={[styles.chipText, selectedPriceRange === index && styles.chipTextActive]}>
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

            </ScrollView>

            <View style={styles.modalFooter}>
              <View style={{ flexDirection: 'row', gap: Spacing.base }}>
                <View style={{ flex: 1 }}>
                  <Button
                    title="Xóa bộ lọc"
                    variant="outline"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedPriceRange(null);
                      setSelectedSort("newest");
                    }}
                  />
                </View>
                <View style={{ flex: 1.5 }}>
                  <Button
                    title="Áp dụng"
                    variant="primary"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      setModalVisible(false);
                    }}
                  />
                </View>
              </View>
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
    backgroundColor: Colors.neutral.bg,
  },
  headerTitleText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },

  // --- Tool Bar ---
  toolsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
    gap: Spacing.sm,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.bg,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.xs,
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.primary,
    height: '100%',
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.neutral.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Section Header ---
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginVertical: Spacing.base,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary
  },
  resultCount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.neutral.text.secondary
  },

  // --- List & Card ---
  listContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing["2xl"]
  },
  columnWrapper: {
    justifyContent: "space-between",
    gap: Spacing.base,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.base,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.neutral.bg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  cardContent: {
    padding: Spacing.sm,
    gap: 4
  },
  cardTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    marginBottom: 4,
    height: 36,
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.accent.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomRightRadius: BorderRadius.md,
    zIndex: 1,
  },
  discountText: {
    fontSize: 10,
    color: Colors.neutral.white,
    fontWeight: Typography.fontWeight.bold,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral.text.primary,
  },
  soldText: {
    fontSize: 10,
    color: Colors.neutral.text.tertiary,
  },
  priceContainer: {
    marginTop: 2,
  },
  currentPrice: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
  },
  priceRow: {
    height: 16,
    justifyContent: 'center',
  },
  originalPrice: {
    fontSize: 10,
    color: Colors.neutral.text.tertiary,
    textDecorationLine: "line-through"
  },

  // --- Empty State ---
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: Spacing.xl,
  },
  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // --- MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '70%',
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.lg,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.neutral.border,
    marginBottom: Spacing.base,
  },
  modalHeaderContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary
  },
  closeBtn: {
    padding: 4,
  },
  filterSectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.base,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    backgroundColor: Colors.neutral.white,
  },
  chipActive: {
    backgroundColor: Colors.primary.light,
    borderColor: Colors.primary.main,
  },
  chipText: {
    color: Colors.neutral.text.secondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium
  },
  chipTextActive: {
    color: Colors.primary.main,
    fontWeight: Typography.fontWeight.bold,
  },
  modalFooter: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.border,
  },
});