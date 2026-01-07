import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StatusBar as RNStatusBar,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ProductCategory from "@/app/components/Home/ProductCategory";
import ProductFlashSale from "@/app/components/Home/ProductFlashSale";
import ProductMegaSale from "@/app/components/Home/ProductMegaSale";
import ProductRecommend from "@/app/components/Home/ProductRecommend";
import { getCategories, Category } from "@/services/category.service";
import { getLatestProducts, Product } from "@/services/product.service";
import { ActivityIndicator } from "react-native";
import Skeleton from "@/app/components/common/Skeleton";

/* ================= CONSTANT ================= */
const { width } = Dimensions.get("window");
const PADDING_HORIZONTAL = 16;
const BANNER_WIDTH = width - PADDING_HORIZONTAL * 2;

/* ================= TYPES ================= */
interface BannerType {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  showTimer: boolean;
}

/* ================= SCREEN ================= */
export default function Home() {
  const router = useRouter();

  const [activeBanner, setActiveBanner] = useState(0);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const bannerRef = useRef<FlatList>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, products] = await Promise.all([
          getCategories(),
          getLatestProducts(8)
        ]);
        setCategories(cats);
        setLatestProducts(products);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ================= DATA ================= */
  const bannerData: BannerType[] = [
    {
      id: 1,
      title: "Siêu Giảm Giá",
      subtitle: "Giảm tới 50%",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&w=1000",
      showTimer: true,
    },
    {
      id: 2,
      title: "Sưu Tập Mới",
      subtitle: "Hè 2024",
      image:
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&w=1000",
      showTimer: false,
    },
  ];

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (isManualScrolling) return;

    const interval = setInterval(() => {
      const next = activeBanner + 1 >= bannerData.length ? 0 : activeBanner + 1;
      bannerRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveBanner(next);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeBanner, isManualScrolling]);

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / BANNER_WIDTH
    );
    setActiveBanner(index);
    setIsManualScrolling(false);
  };

  const getItemLayout = (_: any, index: number) => ({
    length: BANNER_WIDTH,
    offset: BANNER_WIDTH * index,
    index,
  });

  /* ================= RENDER ================= */
  const renderBannerItem = ({ item }: { item: BannerType }) => (
    <View style={styles.bannerSlide}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>

        {item.showTimer && (
          <View style={styles.timerContainer}>
            <View style={styles.timerBox}><Text style={styles.timerText}>08</Text></View>
            <Text style={styles.timerColon}>:</Text>
            <View style={styles.timerBox}><Text style={styles.timerText}>34</Text></View>
            <Text style={styles.timerColon}>:</Text>
            <View style={styles.timerBox}><Text style={styles.timerText}>52</Text></View>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER SKELETON */}
        <View style={styles.header}>
          <Skeleton width="80%" height={46} borderRadius={5} />
          <Skeleton width={24} height={24} borderRadius={12} />
          <Skeleton width={24} height={24} borderRadius={12} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* BANNER SKELETON */}
          <View style={styles.bannerContainer}>
            <Skeleton width="100%" height={206} borderRadius={8} />
          </View>

          {/* CATEGORY SKELETON */}
          <View style={styles.sectionHeader}>
            <Skeleton width={100} height={20} />
          </View>
          <View style={{ flexDirection: 'row', padding: 16, gap: 12 }}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <Skeleton width={50} height={50} borderRadius={25} />
                <Skeleton width={40} height={10} style={{ marginTop: 8 }} />
              </View>
            ))}
          </View>

          {/* PRODUCT LIST SKELETON */}
          <View style={styles.sectionHeader}>
            <Skeleton width={100} height={20} />
          </View>
          <View style={{ flexDirection: 'row', padding: 16, gap: 12 }}>
            {[1, 2].map((i) => (
              <View key={i} style={{ flex: 1, borderWidth: 1, borderColor: '#EBF0FF', padding: 16, borderRadius: 5 }}>
                <Skeleton width="100%" height={100} borderRadius={5} />
                <Skeleton width="100%" height={15} style={{ marginTop: 12 }} />
                <Skeleton width="60%" height={15} style={{ marginTop: 8 }} />
                <Skeleton width="40%" height={15} style={{ marginTop: 8 }} />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#40BFFF" />
          {/* ============ CẬP NHẬT PHẦN NÀY ============ */}
          <TextInput
            placeholder="Tìm kiếm sản phẩm"
            style={styles.searchInput}
            returnKeyType="search" // Đổi nút Enter thành Search
            onSubmitEditing={(event) => {
              // Lấy từ khóa người dùng nhập
              const query = event.nativeEvent.text;
              // Chuyển trang và truyền params (tùy chọn)
              router.push({
                pathname: "/searchProduct",
                params: { q: query } // Truyền từ khóa qua trang kia để lọc
              });
            }}
          />
          {/* =========================================== */}
        </View>

        <Ionicons name="heart-outline" size={24} color="#9098B1" />

        <View style={{ position: "relative" }}>
          <Ionicons name="notifications-outline" size={24} color="#9098B1" />
          <View style={styles.badge} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BANNER */}
        <View style={styles.bannerContainer}>
          <FlatList
            ref={bannerRef}
            data={bannerData}
            horizontal
            pagingEnabled
            keyExtractor={(i) => i.id.toString()}
            renderItem={renderBannerItem}
            getItemLayout={getItemLayout}
            onMomentumScrollEnd={onMomentumScrollEnd}
            onScrollBeginDrag={() => setIsManualScrolling(true)}
            snapToInterval={BANNER_WIDTH}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
          />

          <View style={styles.pagination}>
            {bannerData.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: activeBanner === i ? "#40BFFF" : "#EBF0FF" },
                ]}
              />
            ))}
          </View>
        </View>

        {/* CATEGORY */}
        <Section title="Danh mục" onPress={() => router.push("/categorys")} />
        <ProductCategory categories={categories.filter(cat => cat.parentId)} />

        {/* FLASH SALE */}
        <Section title="Giá sốc" onPress={() => router.push("/(main)/offer")} />
        <ProductFlashSale products={latestProducts.slice(0, 4)} />

        {/* MEGA SALE */}
        <Section title="Siêu giảm giá" onPress={() => router.push("/(main)/offer")} />
        <ProductMegaSale products={latestProducts.slice(4, 8)} />

        {/* RECOMMEND */}
        <Section
          title="Gợi ý sản phẩm"
          onPress={() => router.push("/explore")}
        />

        <View style={styles.recommendBanner}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&w=800",
            }}
            style={styles.recommendImage}
          />
          <View style={styles.recommendOverlay}>
            <Text style={styles.recommendTitle}>Gợi ý sản phẩm</Text>
            <Text style={styles.recommendSubtitle}>
              Chúng tôi đề xuất tốt nhất cho bạn
            </Text>
          </View>
        </View>

        <ProductRecommend products={latestProducts} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= SECTION HEADER ================= */
const Section = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.seeMore}>See More</Text>
    </TouchableOpacity>
  </View>
);

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EBF0FF",
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EBF0FF",
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 46,
  },

  searchInput: { flex: 1, marginLeft: 6 },

  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FB7181",
  },

  bannerContainer: {
    margin: 16,
    height: 206,
  },

  bannerSlide: {
    width: BANNER_WIDTH,
    height: 206,
    borderRadius: 8,
    overflow: "hidden",
  },

  bannerImage: { width: "100%", height: "100%" },
  bannerOverlay: { position: "absolute", top: 32, left: 24 },
  bannerTitle: { fontSize: 24, fontWeight: "700", color: "#fff" },
  bannerSubtitle: { fontSize: 24, fontWeight: "700", color: "#fff", marginBottom: 12 },

  timerContainer: { flexDirection: "row", alignItems: "center" },
  timerBox: { backgroundColor: "#fff", padding: 8, borderRadius: 5 },
  timerText: { fontWeight: "700" },
  timerColon: { color: "#fff", marginHorizontal: 4 },

  pagination: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },

  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 20,
  },

  sectionTitle: { fontSize: 16, fontWeight: "700" },
  seeMore: { color: "#40BFFF", fontWeight: "700" },

  recommendBanner: {
    margin: 16,
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },

  recommendImage: { width: "100%", height: "100%" },
  recommendOverlay: { position: "absolute", top: 30, left: 24 },
  recommendTitle: { color: "#fff", fontSize: 22, fontWeight: "700" },
  recommendSubtitle: { color: "#fff", marginTop: 6 },
});