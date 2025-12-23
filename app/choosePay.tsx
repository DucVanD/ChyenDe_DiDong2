import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// 1. Dữ liệu thẻ giả lập
const myCards = [
  {
    id: "1",
    cardNumber: "6326 9124 8124 9875",
    cardHolder: "LOREM IPSUM",
    expiry: "12/29",
    cvv: "123",
    type: "MasterCard",
    color: "#40BFFF", // Màu xanh chủ đạo
  },
  {
    id: "2",
    cardNumber: "4124 7124 9128 1234",
    cardHolder: "REX4DOM",
    expiry: "10/25",
    cvv: "456",
    type: "Visa",
    color: "#00457C", // Màu xanh đậm
  },
];

export default function ChoosePay() {
  const router = useRouter();
  const [selectedCardId, setSelectedCardId] = useState("1");

  // 2. Component hiển thị thẻ ATM
  const renderCard = (item: typeof myCards[0]) => {
    const isSelected = item.id === selectedCardId;

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.9}
        onPress={() => setSelectedCardId(item.id)}
        style={[
          styles.cardContainer,
          { backgroundColor: item.color },
          isSelected && styles.selectedCardBorder, // Viền nổi bật khi chọn
        ]}
      >
        <View style={styles.cardHeader}>
            {/* Logo chip giả lập */}
            <Ionicons name="hardware-chip-outline" size={32} color="rgba(255,255,255,0.8)" />
            <Text style={styles.cardType}>{item.type}</Text>
        </View>

        <Text style={styles.cardNumber}>
          {item.cardNumber.replace(/(\d{4})/g, "$1  ").trim()}
        </Text>

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.label}>CARD HOLDER</Text>
            <Text style={styles.value}>{item.cardHolder}</Text>
          </View>
          <View>
            <Text style={styles.label}>CARD SAVE</Text>
            <Text style={styles.value}>{item.expiry}</Text>
          </View>
        </View>

        {/* Icon checkmark lớn mờ mờ nếu đang chọn */}
        {isSelected && (
           <View style={styles.checkMarkOverlay}>
                <Ionicons name="checkmark-circle" size={100} color="rgba(255,255,255,0.2)" />
           </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Card</Text>
        <TouchableOpacity 
            onPress={() => console.log("Add new card")} // Logic thêm thẻ
            style={styles.addButton}
        >
            <Ionicons name="add" size={24} color="#40BFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Danh sách thẻ */}
        {myCards.map((card) => renderCard(card))}
      </ScrollView>

      {/* Footer Pay Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
            style={styles.payButton}
            onPress={() => {
                // Xử lý thanh toán thành công
                router.push("/success"); // Giả sử có trang success
            }}
        >
          <Text style={styles.payButtonText}>Pay $766.86</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EBF0FF",
  },
  backButton: { paddingRight: 16 },
  addButton: { paddingLeft: 16 },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: '#223263',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  
  // Card Styles
  cardContainer: {
    height: 190,
    borderRadius: 15,
    padding: 24,
    justifyContent: "space-between",
    marginBottom: 20,
    elevation: 5, // Shadow Android
    shadowColor: "#000", // Shadow iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedCardBorder: {
    borderWidth: 3,
    borderColor: '#FFD700', // Viền vàng khi chọn
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: '#fff',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  cardNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginBottom: 4,
  },
  value: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkMarkOverlay: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },

  // Footer Styles
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EBF0FF",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  payButton: {
    backgroundColor: "#40BFFF",
    padding: 16,
    borderRadius: 5,
    alignItems: "center",
    shadowColor: "#40BFFF",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  payButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});