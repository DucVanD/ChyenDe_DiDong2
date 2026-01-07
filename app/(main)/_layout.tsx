import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useState, useEffect } from "react";
import { getCartCount } from "@/services/cart.service";
import { useFocusEffect } from "@react-navigation/native";

export default function MainLayout() {
  const [cartBadge, setCartBadge] = useState<number | undefined>(undefined);

  // Load cart count
  const loadCartBadge = async () => {
    const count = await getCartCount();
    setCartBadge(count > 0 ? count : undefined);
  };

  // Auto-refresh badge on focus
  useFocusEffect(
    React.useCallback(() => {
      loadCartBadge();
    }, [])
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#40BFFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
        },
      }}
    >
      {/* 1. Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          )
        }}
      />

      {/* 2. explore */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Khám phá",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Giỏ hàng",
          tabBarBadge: cartBadge,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 4. offer */}
      <Tabs.Screen
        name="offer"
        options={{
          title: "Ưu đãi",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "pricetags" : "pricetags-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* 5. Profile */}
      <Tabs.Screen
        name="account"
        options={{
          title: "Tài khoản",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />


    </Tabs>
  );
}
