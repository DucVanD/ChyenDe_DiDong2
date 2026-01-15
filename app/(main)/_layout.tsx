import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { getCartCount } from "@/services/cart.service";
import { useFocusEffect } from "@react-navigation/native";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows, Spacing, BorderRadius } from "@/constants/theme";

export default function MainLayout() {
  const [cartBadge, setCartBadge] = useState<number | undefined>(undefined);
  const router = useRouter();

  // Load cart count
  const loadCartBadge = async () => {
    const { getCartCount } = require("@/services/cart.service");
    const count = await getCartCount();
    setCartBadge(count > 0 ? count : undefined);
  };

  // Auto-refresh badge on focus and via subscription
  useEffect(() => {
    const { subscribeToCartChanges } = require("@/services/cart.service");
    loadCartBadge(); // Initial load

    // Subscribe to real-time changes
    const unsubscribe = subscribeToCartChanges((count: number) => {
      setCartBadge(count > 0 ? count : undefined);
    });

    return () => unsubscribe();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadCartBadge();
    }, [])
  );

  // 1. Memoize screen options to prevent re-rendering tabs unnecessarily
  const screenOptions = React.useMemo(() => ({
    headerShown: false,
    tabBarActiveTintColor: Colors.primary.main,
    tabBarInactiveTintColor: Colors.neutral.text.tertiary,
    tabBarStyle: {
      height: Platform.OS === 'ios' ? 88 : 68,
      paddingBottom: Platform.OS === 'ios' ? 30 : 12,
      paddingTop: 8,
      backgroundColor: Colors.neutral.white,
      borderTopWidth: 1,
      borderTopColor: Colors.neutral.border,
      ...Shadows.md,
    },
    tabBarLabelStyle: {
      fontSize: 10,
      fontWeight: '600' as const,
      marginTop: 2,
    },
    tabBarBadgeStyle: {
      backgroundColor: Colors.accent.error,
      color: Colors.neutral.white,
      fontSize: 10,
      lineHeight: 15,
      marginTop: Platform.OS === 'ios' ? 0 : 2,
    },
  }), []);

  // 2. Memoize tab icons
  const tabIcons = React.useMemo(() => ({
    home: (color: string, focused: boolean) => <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />,
    search: (color: string, focused: boolean) => <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />,
    cart: (color: string, focused: boolean) => <Ionicons name={focused ? "cart" : "cart-outline"} size={26} color={color} />,
    offer: (color: string, focused: boolean) => <Ionicons name={focused ? "pricetags" : "pricetags-outline"} size={24} color={color} />,
    person: (color: string, focused: boolean) => <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />,
  }), []);

  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={screenOptions}>
        {/* 1. Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ color, focused }) => tabIcons.home(color, focused)
          }}
        />

        {/* 2. explore */}
        <Tabs.Screen
          name="explore"
          options={{
            title: "Khám phá",
            tabBarIcon: ({ color, focused }) => tabIcons.search(color, focused),
          }}
        />

        <Tabs.Screen
          name="cart"
          options={{
            title: "Giỏ hàng",
            tabBarBadge: cartBadge,
            tabBarIcon: ({ color, focused }) => tabIcons.cart(color, focused),
          }}
        />

        {/* 4. offer */}
        <Tabs.Screen
          name="offer"
          options={{
            title: "Ưu đãi",
            tabBarIcon: ({ color, focused }) => tabIcons.offer(color, focused),
          }}
        />

        {/* 5. Profile */}
        <Tabs.Screen
          name="account"
          options={{
            title: "Tài khoản",
            tabBarIcon: ({ color, focused }) => tabIcons.person(color, focused),
          }}
        />
      </Tabs>

    </View>
  );
}


