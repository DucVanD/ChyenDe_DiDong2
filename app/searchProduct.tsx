import { useRouter, useLocalSearchParams } from "expo-router";
import { searchProducts, Product } from "@/services/product.service";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import Skeleton from "@/app/components/common/Skeleton";
import FadeInStagger from "@/app/components/common/FadeInStagger";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import DiscountBadge from "@/app/components/common/DiscountBadge";

// Component hiển thị sao
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={12}
          color={i <= rating ? "#FFC833" : "#EBF0FF"}
        />
      ))}
    </View>
  );
};

export default function SearchResultsScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const initialSearch = (searchParams.q as string) || "";

  const [search, setSearch] = useState(initialSearch);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchProducts = async (pageNum: number, isNewSearch = false) => {
    try {
      if (isNewSearch) setLoading(true);
      else setLoadingMore(true);

      const response = await searchProducts(search, pageNum, 10);

      if (isNewSearch) {
        setProducts(response.content);
      } else {
        setProducts(prev => [...prev, ...response.content]);
      }

      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(0, true);
  }, [initialSearch]);

  const loadMore = () => {
    if (!loadingMore && page < totalPages - 1) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  const renderItem = ({ item, index }: { item: Product, index: number }) => (
    <FadeInStagger index={index % 10} style={{ width: '48%' }}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          Haptics.selectionAsync();
          router.push({
            pathname: "/detail",
            params: { id: item.id }
          });
        }}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
          {item.discountPrice && (
            <DiscountBadge
              discount={(1 - item.discountPrice / item.salePrice) * 100}
            />
          )}
        </View>
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.ratingContainer}>
            <StarRating rating={4} />
          </View>

          <Text style={styles.price}>
            {item.discountPrice
              ? (item.discountPrice || 0).toLocaleString('vi-VN')
              : (item.salePrice || 0).toLocaleString('vi-VN')}đ
          </Text>

          <View style={styles.oldPriceContainer}>
            {item.discountPrice && (
              <Text style={styles.oldPrice}>{(item.salePrice || 0).toLocaleString('vi-VN')}đ</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </FadeInStagger>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.neutral.text.primary} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.neutral.text.tertiary} />
          <TextInput
            placeholder="Tìm kiếm sản phẩm..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setPage(0);
              fetchProducts(0, true);
            }}
            autoFocus
          />
        </View>
      </View>

      <View style={styles.resultInfo}>
        <Text style={styles.resultText}>
          {loading ? "Đang tìm kiếm..." : `${totalElements} kết quả cho "${search}"`}
        </Text>
      </View>

      {loading && page === 0 ? (
        <View style={{ flex: 1, padding: Spacing.base }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <View key={i} style={[styles.card, { width: '48%' }]}>
                <Skeleton width="100%" height={120} borderRadius={8} />
                <View style={{ padding: 10 }}>
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
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator color={Colors.primary.main} style={{ margin: Spacing.base }} /> : null}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50, paddingHorizontal: 40 }}>
              <LottieView
                source={{ uri: 'https://assets3.lottiefiles.com/packages/lf20_ghp9v0v0.json' }}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
              <Text style={{ color: Colors.neutral.text.primary, fontWeight: '700', fontSize: 16, marginTop: 16 }}>
                Không tìm thấy kết quả
              </Text>
              <Text style={{ color: Colors.neutral.text.secondary, textAlign: 'center', marginTop: 8 }}>
                Vui lòng thử tìm kiếm với từ khóa khác
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.bg,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    height: 44,
    marginRight: Spacing.base,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.xs,
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.primary,
  },
  iconButton: {
    padding: 8,
    marginRight: Spacing.sm,
  },
  resultInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.base,
  },
  resultText: {
    color: Colors.neutral.text.secondary,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.xs,
  },

  // List Styles
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
  },
  columnWrapper: {
    justifyContent: "space-between",
    gap: Spacing.base,
  },
  card: {
    width: "100%",
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.base,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: "100%",
    height: 140,
    backgroundColor: Colors.neutral.bg,
    position: 'relative',
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    padding: Spacing.sm,
    alignItems: "flex-start",
  },
  title: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    marginBottom: 4,
    height: 36,
  },
  ratingContainer: {
    marginBottom: 4,
  },
  price: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
    marginBottom: 4,
  },
  oldPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 16, // Reserve space for old price to prevent bập bênh
  },
  oldPrice: {
    fontSize: 10,
    color: Colors.neutral.text.tertiary,
    textDecorationLine: "line-through",
    marginRight: 6,
  },
});