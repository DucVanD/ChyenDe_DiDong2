import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FadeInStagger from "../common/FadeInStagger";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import DiscountBadge from "../common/DiscountBadge";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

import { Product } from "@/services/product.service";
import * as Haptics from 'expo-haptics';

interface Props {
  products: Product[];
}

export default function ProductRecommend({ products }: Props) {
  const router = useRouter(); // <--- 2. Khởi tạo Router

  // <--- 3. Di chuyển renderItem vào bên trong để dùng được router
  const renderItem = ({ item, index }: { item: Product, index: number }) => (
    <FadeInStagger index={index} style={{ width: '48%' }}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          Haptics.selectionAsync();
          router.push({
            pathname: "/detail", // Đường dẫn gốc (tên file)
            params: { id: item.id }    // Tham số truyền vào
          });
        }}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.image }} style={styles.image} />
          {item.discountPrice && (
            <DiscountBadge
              discount={(1 - item.discountPrice / item.salePrice) * 100}
            />
          )}
        </View>
        <View style={styles.content}>
          <Text numberOfLines={2} style={styles.name}>
            {item.name}
          </Text>
          <Text style={styles.price}>
            {item.discountPrice
              ? (item.discountPrice || 0).toLocaleString('vi-VN')
              : (item.salePrice || 0).toLocaleString('vi-VN')}đ
          </Text>
          {item.discountPrice && (
            <View style={styles.priceRow}>
              <Text style={styles.oldPrice}>{(item.salePrice || 0).toLocaleString('vi-VN')}đ</Text>
            </View>
          )}
          {!item.discountPrice && <View style={styles.priceRow} />}
        </View>
      </TouchableOpacity>
    </FadeInStagger>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      numColumns={2}
      scrollEnabled={false} // Vì trong Home đã có ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
  },
  columnWrapper: {
    justifyContent: 'space-between',
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
  imageWrapper: {
    width: "100%",
    height: 140,
    backgroundColor: Colors.neutral.bg,
    position: 'relative',
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.accent.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomRightRadius: BorderRadius.md,
  },
  discountText: {
    fontSize: 10,
    color: Colors.neutral.white,
    fontWeight: Typography.fontWeight.bold,
  },
  content: {
    padding: Spacing.sm,
  },
  name: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral.text.primary,
    marginBottom: 4,
    height: 36,
  },
  price: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    height: 16, // Fixed height for price row to avoid see-saw effect
  },
  oldPrice: {
    fontSize: 10,
    color: Colors.neutral.text.tertiary,
    textDecorationLine: "line-through",
  },
});