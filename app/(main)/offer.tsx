import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import ProductDiscount from "@/app/components/offer/ProductDiscount"; // Giữ nguyên import của bạn

export default function OfferScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER: Chuyển thành text Offer lớn bên trái */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Offer</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* 1. BLUE COUPON BANNER */}
        <View style={styles.couponBanner}>
          <Text style={styles.couponText}>
            Use “MEGSL” Cupon For{"\n"}Get 90%off
          </Text>
        </View>

        {/* 2. SUPER FLASH SALE BANNER (Có đồng hồ) */}
        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", // Giày đỏ/đen
            }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Super Flash Sale</Text>
            <Text style={styles.bannerSubtitle}>50% Off</Text>

            <View style={styles.timerContainer}>
              <View style={styles.timerBox}>
                <Text style={styles.timerText}>08</Text>
              </View>
              <Text style={styles.timerColon}>:</Text>
              <View style={styles.timerBox}>
                <Text style={styles.timerText}>34</Text>
              </View>
              <Text style={styles.timerColon}>:</Text>
              <View style={styles.timerBox}>
                <Text style={styles.timerText}>52</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. SUPER MEGA SALE BANNER (Màu hồng/tím) */}
        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1560769629-975e13f0c470?auto=format&fit=crop&w=800&q=80", // Giày style fashion/hồng
            }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>90% Off Super Mega Sale</Text>
            <Text style={styles.specialText}>Special birthday Lafyuu</Text>
          </View>
        </View>

        {/* 4. LIST SẢN PHẨM GIẢM GIÁ (Giữ nguyên component cũ) */}
        <View style={styles.productListContainer}>
             <ProductDiscount />
        </View>
       
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // --- Header Styles ---
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EBF0FF",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18, // Kích thước chữ tiêu đề Offer
    fontWeight: "700",
    color: "#223263",
    textAlign: "left",
  },

  // --- Blue Coupon Banner ---
  couponBanner: {
    backgroundColor: "#40BFFF", // Màu xanh dương giống hình
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  couponText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24, // Tăng khoảng cách dòng để dễ đọc
    width: "70%", // Giới hạn chiều rộng để text xuống dòng giống hình
  },

  // --- General Banner Styles ---
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
    height: 206,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center", // Căn giữa nội dung theo chiều dọc
    paddingLeft: 24,
    backgroundColor: 'rgba(0,0,0,0.1)' // Thêm lớp phủ nhẹ để chữ nổi hơn nếu ảnh sáng
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    width: "70%", // Giới hạn chiều rộng text
  },
  bannerSubtitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  specialText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#fff",
    marginTop: 4,
  },

  // --- Timer Styles ---
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerBox: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#223263",
  },
  timerColon: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginHorizontal: 8,
  },

  // --- Product List Container ---
  productListContainer: {
    marginTop: 16,
  }
});