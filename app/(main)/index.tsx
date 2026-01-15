import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import * as Haptics from 'expo-haptics';
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
import ProductNewArrivals from "@/app/components/Home/ProductNewArrivals";
import ProductMegaSale from "@/app/components/Home/ProductMegaSale";
import ProductRecommend from "@/app/components/Home/ProductRecommend";
import { getCategories, Category } from "@/services/category.service";
import { getLatestProducts, getMegaSaleProducts, getBestSellingProducts, Product } from "@/services/product.service";
import { ActivityIndicator } from "react-native";
import Skeleton from "@/app/components/common/Skeleton";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";

/* ================= CONSTANT ================= */
const { width } = Dimensions.get("window");
const PADDING_HORIZONTAL = 16;
const BANNER_WIDTH = width - PADDING_HORIZONTAL * 2;

/* ================= TYPES ================= */
interface BannerType {
  id: number;
  title: string;
  subtitle: string;
  image: any;
  showTimer: boolean;
}

/* ================= SCREEN ================= */
export default function Home() {
  const router = useRouter();

  const [activeMainBanner, setActiveMainBanner] = useState(0);
  const [activeRecBanner, setActiveRecBanner] = useState(0);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const mainBannerRef = useRef<FlatList>(null);
  const recBannerRef = useRef<FlatList>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [megaSaleProducts, setMegaSaleProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, products, mega, best] = await Promise.all([
          getCategories(),
          getLatestProducts(10), // Tăng số lượng sản phẩm mới hiển thị
          getMegaSaleProducts(4),
          getBestSellingProducts(10)
        ]);
        setCategories(cats);
        setLatestProducts(products);
        setMegaSaleProducts(mega);
        setBestSellingProducts(best);
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
      title: "Phong Cách Nam",
      subtitle: "Casual Collection",
      image: require("@/assets/images/menswear-polo-shirt-white-casual-apparel-outdoor-shoot.jpg"),
      showTimer: true,
    },
    {
      id: 2,
      title: "Phụ Kiện Hot",
      subtitle: "Trucker Hat Style",
      image: require("@/assets/images/woman-wearing-pink-trucker-hat-medium-shot.jpg"),
      showTimer: false,
    },
    {
      id: 3,
      title: "Váy Hè Năng Động",
      subtitle: "Trendy Pink Dress",
      image: require("@/assets/images/portrait-young-beautiful-smiling-girl-trendy-summer-light-pink-dress-sexy-carefree-woman-posing-positive-model-having-fun-dancing.jpg"),
      showTimer: false,
    },
    {
      id: 4,
      title: "Fashion Vacation",
      subtitle: "Summer Blue Dress",
      image: require("@/assets/images/young-stylish-beautiful-woman-blue-dress-summer-fashion-trend-vacation-garden-tropical-hotel-terrace-smiling.jpg"),
      showTimer: false,
    },
  ];

  const recommendBannerData: BannerType[] = [
    {
      id: 1,
      title: "Quản Lý Kho",
      subtitle: "Smart Scanning",
      image: require("@/assets/images/beautiful-smart-asian-young-entrepreneur-business-woman-owner-sme-checking-product-stock-scan-qr-code-working-home.jpg"),
      showTimer: false,
    },
    {
      id: 2,
      title: "Ưu Đãi Đặc Biệt",
      subtitle: "Flash Sale Now",
      image: require("@/assets/images/front-view-female-builder-holding-red-sale-board-white-wall.jpg"),
      showTimer: false,
    },
    {
      id: 3,
      title: "Mua Sắm Thả Ga",
      subtitle: "Top Trending",
      image: require("@/assets/images/woman-addicted-shopping.jpg"),
      showTimer: false,
    },
  ];

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (isManualScrolling) return;

    const interval = setInterval(() => {
      // Main Banner
      const nextMain = activeMainBanner + 1 >= bannerData.length ? 0 : activeMainBanner + 1;
      mainBannerRef.current?.scrollToIndex({ index: nextMain, animated: true });
      setActiveMainBanner(nextMain);

      // Recommend Banner
      const nextRec = activeRecBanner + 1 >= recommendBannerData.length ? 0 : activeRecBanner + 1;
      recBannerRef.current?.scrollToIndex({ index: nextRec, animated: true });
      setActiveRecBanner(nextRec);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeMainBanner, activeRecBanner, isManualScrolling]);

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / BANNER_WIDTH
    );
    setActiveMainBanner(index);
    setIsManualScrolling(false);
  };

  const onRecMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / BANNER_WIDTH
    );
    setActiveRecBanner(index);
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
      <Image
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={styles.bannerImage}
        resizeMode="cover"
      />
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
          <Ionicons name="search-outline" size={20} color={Colors.neutral.text.tertiary} />
          <TextInput
            placeholder="Tìm kiếm sản phẩm"
            placeholderTextColor={Colors.neutral.text.tertiary}
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={(event) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              const query = event.nativeEvent.text;
              router.push({
                pathname: "/products",
                params: { q: query }
              });
            }}
          />
        </View>

        <TouchableOpacity
          style={[styles.iconButton, styles.aiButton]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/chat");
          }}
        >
          <MaterialCommunityIcons name="robot" size={20} color={Colors.primary.main} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Ionicons name="heart-outline" size={22} color={Colors.neutral.text.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/notifications');
          }}
        >
          <Ionicons name="notifications-outline" size={22} color={Colors.neutral.text.primary} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BANNER */}
        <View style={styles.bannerContainer}>
          <FlatList
            ref={mainBannerRef}
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
                  { backgroundColor: activeMainBanner === i ? Colors.primary.main : Colors.neutral.border },
                ]}
              />
            ))}
          </View>
        </View>

        {/* CATEGORY */}
        <Section title="Danh mục" onPress={() => router.push("/categorys")} />
        <ProductCategory categories={categories.filter(cat => cat.parentId)} />

        {/* NEW ARRIVALS */}
        <Section title="Sản phẩm mới" onPress={() => router.push("/products")} />
        <ProductNewArrivals products={latestProducts} />

        {/* MEGA SALE */}
        <Section title="Siêu giảm giá" onPress={() => router.push("/products")} />
        <ProductMegaSale products={megaSaleProducts} />

        <View style={styles.bannerContainer}>
          <FlatList
            ref={recBannerRef}
            data={recommendBannerData}
            horizontal
            pagingEnabled
            keyExtractor={(i) => i.id.toString()}
            renderItem={renderBannerItem}
            getItemLayout={getItemLayout}
            onMomentumScrollEnd={onRecMomentumScrollEnd}
            onScrollBeginDrag={() => setIsManualScrolling(true)}
            snapToInterval={BANNER_WIDTH}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
          />

          <View style={styles.pagination}>
            {recommendBannerData.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: activeRecBanner === i ? Colors.primary.main : Colors.neutral.border },
                ]}
              />
            ))}
          </View>
        </View>

        <Section
          title="Gợi ý sản phẩm"
          onPress={() => router.push("/products")}
        />

        <ProductRecommend products={bestSellingProducts} />
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
    <TouchableOpacity
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
    >
      <Text style={styles.seeMore}>Xem thêm</Text>
    </TouchableOpacity>
  </View>
);


/* ================= STYLE ================= */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    minHeight: 68,
    gap: Spacing.md,
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.bg,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.neutral.text.primary,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral.bg,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  aiButton: {
    backgroundColor: Colors.primary.light,
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },

  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent.error,
  },

  bannerContainer: {
    margin: Spacing.base,
    height: 206,
  },

  bannerSlide: {
    width: BANNER_WIDTH,
    height: 206,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },

  bannerImage: { width: "100%", height: "100%" },
  bannerOverlay: { position: "absolute", top: 32, left: 24 },
  bannerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.white,
  },
  bannerSubtitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.white,
    marginBottom: Spacing.md,
  },

  timerContainer: { flexDirection: "row", alignItems: "center" },
  timerBox: {
    backgroundColor: Colors.neutral.white,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  timerText: { fontWeight: Typography.fontWeight.bold },
  timerColon: { color: Colors.neutral.white, marginHorizontal: 4 },

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
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },

  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  seeMore: {
    color: Colors.primary.main,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.sm,
  },

  recommendBanner: {
    margin: Spacing.base,
    height: 200,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },

  recommendImage: { width: "100%", height: "100%" },
  recommendOverlay: { position: "absolute", top: 30, left: 24 },
  recommendTitle: {
    color: Colors.neutral.white,
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
  },
  recommendSubtitle: { color: Colors.neutral.white, marginTop: 6 },
});
