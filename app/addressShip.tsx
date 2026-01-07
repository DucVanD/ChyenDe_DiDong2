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
import { useRouter } from "expo-router";
import { getStoredUser, UserInfo } from "@/services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedId;
    const router = useRouter();
    return (
      <TouchableOpacity
        style={[
          styles.card,
          isSelected ? styles.cardActive : styles.cardInactive, // Logic đổi màu viền
        ]}
        onPress={() => setSelectedId(item.id)}
      >
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.addressText}>{item.address}</Text>
        <Text style={styles.phoneText}>{item.phone}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteIcon}>
            <Ionicons name="trash-outline" size={24} color="#9098B1" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Nút Back: Sử dụng goBack() để quay lại màn hình trước đó (Cart) */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Giao đến</Text>

        {/* Nút Add New (bên phải) */}
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="#40BFFF" />
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
        <TouchableOpacity
          style={styles.nextButton}
          // 2. Lưu địa chỉ đặt hàng vào AsyncStorage
          onPress={async () => {
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
        >
          <Text style={styles.nextButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EBF0FF",
  },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#223263" },
  listContainer: { padding: 16 },

  // Card Styles
  card: { padding: 24, borderRadius: 5, marginBottom: 16, borderWidth: 1 },
  cardActive: { borderColor: "#40BFFF", backgroundColor: "#FFFFFF" }, // Màu viền khi chọn
  cardInactive: { borderColor: "#EBF0FF", backgroundColor: "#FFFFFF" }, // Màu viền mặc định

  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#223263",
    marginBottom: 12,
  },
  addressText: {
    fontSize: 12,
    color: "#9098B1",
    lineHeight: 22,
    marginBottom: 8,
  },
  phoneText: { fontSize: 12, color: "#9098B1", marginBottom: 16 },

  actionRow: { flexDirection: "row", alignItems: "center" },
  editButton: {
    backgroundColor: "#40BFFF",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginRight: 20,
  },
  editButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },

  // Footer Styles
  footer: { padding: 16 },
  nextButton: {
    backgroundColor: "#40BFFF",
    padding: 16,
    borderRadius: 5,
    alignItems: "center",
    shadowColor: "#40BFFF",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  nextButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});

export default AddressScreen;
