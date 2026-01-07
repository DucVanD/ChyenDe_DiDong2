import { filterProducts, Product, searchProducts } from "@/services/product.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import Skeleton from "@/app/components/common/Skeleton";
import FadeInStagger from "@/app/components/common/FadeInStagger";

// Component hiển thị sao
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= rating ? "star" : "star-outline"}
        size={12}
        color="#FFC107"
      />
    );
  }
  return <View style={{ flexDirection: "row" }}>{stars}</View>;
};

export default function SearchProduct() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialQuery = params.q?.toString() || "";
  const categoryId = params.categoryId ? Number(params.categoryId) : null;

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchProducts = useCallback(async (pageNum: number, isNewSearch = false) => {
    try {
      if (isNewSearch) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let response;
      if (categoryId) {
        // Nếu có categoryId, ưu tiên lọc theo category
        response = await filterProducts({
          categoryId: [categoryId],
          page: pageNum,
          size: 10
        });
      } else if (searchQuery) {
        // Nếu có query, tìm kiếm
        response = await searchProducts(searchQuery, pageNum, 10);
      } else {
        // Mặc định lấy tất cả hoặc lọc trống
        response = await filterProducts({
          page: pageNum,
          size: 10
        });
      }

      if (isNewSearch) {
        setProducts(response.content);
      } else {
        setProducts(prev => [...prev, ...response.content]);
      }

      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, categoryId]);

  useEffect(() => {
    setPage(0);
    fetchProducts(0, true);
  }, [initialQuery, categoryId]);

  const handleSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPage(0);
    fetchProducts(0, true);
  };

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
        style={[styles.card, { width: '100%' }]}
        onPress={() =>
          router.push({
            pathname: "/detail",
            params: { id: item.id }
          })
        }
      >
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
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

          {item.discountPrice && (
            <View style={styles.oldPriceContainer}>
              <Text style={styles.oldPrice}>{(item.salePrice || 0).toLocaleString('vi-VN')}đ</Text>
              <Text style={styles.discount}>
                {Math.round((1 - item.discountPrice / item.salePrice) * 100)}% Off
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </FadeInStagger>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#40BFFF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Ionicons name="filter-outline" size={24} color="#9098B1" />
        </TouchableOpacity>
      </View>

      <View style={styles.resultInfo}>
        <Text style={styles.resultText}>{totalElements} Kết quả</Text>
        {categoryId && <Text style={styles.resultText}>Danh mục: {params.categoryName || categoryId}</Text>}
      </View>

      {loading ? (
        <View style={styles.listContent}>
          <View style={styles.row}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={[styles.card, { width: '48%' }]}>
                <Skeleton width="100%" height={100} borderRadius={5} />
                <Skeleton width="100%" height={15} style={{ marginTop: 12 }} />
                <Skeleton width="60%" height={15} style={{ marginTop: 8 }} />
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
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator color="#40BFFF" style={{ margin: 16 }} /> : null}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50, paddingHorizontal: 40 }}>
              <LottieView
                source={{ uri: 'https://assets3.lottiefiles.com/packages/lf20_ghp9v0v0.json' }} // No results
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
              <Text style={{ color: '#223263', fontWeight: '700', fontSize: 16, marginTop: 16 }}>
                Không tìm thấy kết quả
              </Text>
              <Text style={{ color: '#9098B1', textAlign: 'center', marginTop: 8 }}>
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