import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const OrderDetai = () => {
  const router = useRouter();

  // Dữ liệu mẫu (Dummy Data)
  const products = [
    {
      id: '1',
      name: 'Nike Air Zoom Pegasus 36 Miami',
      price: '$299,43',
      image: { uri: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-665455a5-45de-40fb-945f-c1852b82400d/air-zoom-pegasus-37-running-shoe-mwrTCc.jpg' }, // Thay bằng ảnh thật của bạn
      isFavorite: true,
    },
    {
      id: '2',
      name: 'Nike Air Zoom Pegasus 36 Miami',
      price: '$299,43',
      image: { uri: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-512bfa8a-01a0-4971-bd34-9ef68fb6b7fa/air-zoom-pegasus-37-running-shoe-mwrTCc.jpg' },
      isFavorite: false,
    },
  ];

  // Các bước trong quy trình vận đơn
  const steps = ['Packing', 'Shipping', 'Arriving', 'Success'];
  const currentStep = 2; // 0: Packing, 1: Shipping, 2: Arriving... (Dựa vào hình là đang ở bước 3)

  // Component hiển thị Stepper (Thanh trạng thái)
  const renderStepper = () => {
    return (
      <View style={styles.stepperContainer}>
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isLast = index === steps.length - 1;

          return (
            <View key={index} style={styles.stepItemWrapper}>
              {/* Vòng tròn icon */}
              <View style={styles.stepItem}>
                {isActive ? (
                  <Ionicons name="checkmark-circle" size={32} color="#40BFFF" />
                ) : (
                  <Ionicons name="checkmark-circle-outline" size={32} color="#EBF0FF" />
                )}
                <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
                  {step}
                </Text>
              </View>

              {/* Đường kẻ nối (Line) - Không vẽ cho phần tử cuối cùng */}
              {!isLast && (
                <View style={[styles.stepLine, index < currentStep && styles.stepLineActive]} />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* 2. Stepper Section */}
        {renderStepper()}

        {/* 3. Product List */}
        <Text style={styles.sectionTitle}>Product</Text>
        <View style={styles.productList}>
          {products.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <Image source={item.image} style={styles.productImage} resizeMode="contain" />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
              </View>
              <TouchableOpacity>
                 <Ionicons 
                    name={item.isFavorite ? "heart" : "heart-outline"} 
                    size={24} 
                    color={item.isFavorite ? "#FB7181" : "#9098B1"} 
                 />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* 4. Shipping Details */}
        <Text style={styles.sectionTitle}>Shipping Details</Text>
        <View style={styles.detailCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Date Shipping</Text>
            <Text style={styles.value}>January 16, 2020</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shipping</Text>
            <Text style={styles.value}>POS Reggular</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>No. Resi</Text>
            <Text style={styles.value}>000192848573</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address</Text>
            <Text style={[styles.value, styles.addressValue]}>
              2727 New Owerri, Owerri, Imo State 78410
            </Text>
          </View>
        </View>

        {/* 5. Payment Details */}
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={styles.detailCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Items (3)</Text>
            <Text style={styles.value}>$598.86</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shipping</Text>
            <Text style={styles.value}>$40.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Import charges</Text>
            <Text style={styles.value}>$128.00</Text>
          </View>
          
          {/* Dashed Line */}
          <View style={styles.dashedLine} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalPrice}>$766.86</Text>
          </View>
        </View>

        {/* 6. Notify Button */}
        <TouchableOpacity style={styles.notifyButton}>
          <Text style={styles.notifyButtonText}>Notify Me</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBF0FF',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#223263',
  },
  backButton: { padding: 4 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  // --- Stepper Styles ---
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  stepItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Để chia đều không gian
  },
  stepItem: {
    alignItems: 'center',
    zIndex: 1, // Để icon nằm đè lên line nếu cần
    backgroundColor: '#fff',
  },
  stepLabel: {
    fontSize: 10, // Font nhỏ
    color: '#9098B1',
    marginTop: 8,
    textAlign: 'center',
  },
  stepLabelActive: { color: '#40BFFF' },
  stepLine: {
    flex: 1, // Line chiếm hết khoảng trống còn lại giữa các icon
    height: 2,
    backgroundColor: '#EBF0FF',
    marginBottom: 20, // Căn chỉnh line ngang hàng với tâm icon
    marginHorizontal: -10, // Kỹ thuật để line nối liền
    zIndex: -1,
  },
  stepLineActive: { backgroundColor: '#40BFFF' },

  // --- Section Common ---
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#223263',
    marginTop: 12,
    marginBottom: 12,
  },

  // --- Product Card ---
  productList: { marginBottom: 12 },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBF0FF',
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
  },
  productImage: {
    width: 70,
    height: 70,
    marginRight: 12,
  },
  productInfo: { flex: 1 },
  productName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#223263',
    marginBottom: 4,
    width: '90%', // Tránh đè lên icon tim
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#40BFFF',
  },

  // --- Detail Card (Shipping & Payment) ---
  detailCard: {
    borderWidth: 1,
    borderColor: '#EBF0FF',
    borderRadius: 5,
    padding: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#9098B1',
    flex: 1,
  },
  value: {
    fontSize: 12,
    color: '#223263',
    flex: 2, // Dành nhiều chỗ hơn cho giá trị
    textAlign: 'right',
  },
  addressValue: {
    lineHeight: 18, // Tăng khoảng cách dòng cho địa chỉ dài
  },
  dashedLine: {
    height: 1,
    borderWidth: 1,
    borderColor: '#EBF0FF',
    borderStyle: 'dashed',
    marginBottom: 12,
    marginTop: 4,
    borderRadius: 1,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#223263',
  },
  totalPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#40BFFF',
  },

  // --- Button ---
  notifyButton: {
    backgroundColor: '#40BFFF',
    paddingVertical: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#40BFFF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  notifyButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default OrderDetai;