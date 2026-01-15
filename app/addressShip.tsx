import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Sử dụng icon set
import { router, useNavigation } from "expo-router";
import { getStoredUser, UserInfo } from "@/services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';
import { Button } from "./components/common/Button";
import * as Haptics from 'expo-haptics';
const AddressScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  // State quản lý danh sách và ID đang được chọn
  const [selectedId, setSelectedId] = useState("1");

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await getStoredUser();
        setUser(storedUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  // Prepare addresses from user data
  const addresses = user ? [
    {
      id: "1",
      name: user.name || "Người dùng",
      address: user.address || "Chưa cập nhật địa chỉ",
      phone: user.phone || "Chưa cập nhật",
    },
  ] : [];

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        style={[
          styles.card,
          isSelected && styles.cardActive,
        ]}
        onPress={() => {
          Haptics.selectionAsync();
          setSelectedId(item.id);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name}</Text>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={20} color={Colors.primary.main} />
          )}
        </View>

        <Text style={styles.addressText}>{item.address}</Text>
        <Text style={styles.phoneText}>{item.phone}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editButton} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <Text style={styles.editButtonText}>Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteIcon} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}>
            <Ionicons name="trash-outline" size={20} color={Colors.accent.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.neutral.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ giao hàng</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
          <Ionicons name="add" size={24} color={Colors.primary.main} />
        </TouchableOpacity>
      </View>

      {/* List Address */}
      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Footer Button */}
      <View style={styles.footer}>
        <Button
          title="Tiếp tục"
          onPress={async () => {
            Haptics.selectionAsync();
            const selectedAddress = addresses.find(addr => addr.id === selectedId);
            if (selectedAddress) {
              await AsyncStorage.setItem('checkout_address', JSON.stringify({
                name: selectedAddress.name,
                address: selectedAddress.address,
                phone: selectedAddress.phone
              }));
            }
            router.push("/paymentMethod");
          }}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Spacing.base,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
    backgroundColor: Colors.neutral.white,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  addButton: {
    padding: 4,
  },
  listContainer: {
    padding: Spacing.base,
  },

  // Card Styles
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.neutral.border,
    backgroundColor: Colors.neutral.white,
    ...Shadows.sm,
  },
  cardActive: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light + '40', // Very light primary bg
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  addressText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  phoneText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.tertiary,
    marginBottom: Spacing.lg,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.base,
  },
  editButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 8,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  editButtonText: {
    color: Colors.neutral.white,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
  },
  deleteIcon: {
    padding: 8,
  },

  // Footer Styles
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.border,
  },
});

export default AddressScreen;
