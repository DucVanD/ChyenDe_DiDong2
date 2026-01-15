import { useRouter } from "expo-router";
import React from "react";
import {
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

import { Product } from "@/services/product.service";
import * as Haptics from 'expo-haptics';

interface Props {
    products: Product[];
}

export default function ProductNewArrivals({ products }: Props) {
    const router = useRouter();

    const renderHorizontalProduct = ({ item, index }: { item: Product, index: number }) => (
        <FadeInStagger index={index}>
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
                    <Image source={{ uri: item.image }} style={styles.image} />
                    {item.discountPrice && (
                        <DiscountBadge
                            discount={(1 - item.discountPrice / item.salePrice) * 100}
                        />
                    )}
                </View>
                <View style={styles.content}>
                    <Text style={styles.name} numberOfLines={2}>
                        {item.name}
                    </Text>
                    <Text style={styles.price}>
                        {item.discountPrice
                            ? (item.discountPrice || 0).toLocaleString('vi-VN')
                            : (item.salePrice || 0).toLocaleString('vi-VN')}đ
                    </Text>
                    <View style={styles.priceRow}>
                        {item.discountPrice && (
                            <Text style={styles.oldPrice}>{(item.salePrice || 0).toLocaleString('vi-VN')}đ</Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </FadeInStagger>
    );

    return (
        <View>
            <FlatList
                data={products}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: Spacing.base }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderHorizontalProduct}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 150,
        marginRight: Spacing.base,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.neutral.white,
        ...Shadows.sm,
        borderWidth: 1,
        borderColor: Colors.neutral.border,
        overflow: 'hidden',
        marginBottom: Spacing.sm,
    },
    imageWrapper: {
        width: "100%",
        height: 130,
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
        fontWeight: Typography.fontWeight.bold,
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
        height: 16, // Reserve space for old price to prevent bập bênh
    },
    oldPrice: {
        fontSize: 10,
        color: Colors.neutral.text.tertiary,
        textDecorationLine: "line-through",
    },
});
