import { getOrderById, Order, getStatusNumber } from '@/services/order.service';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const OrderDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const orderId = Number(id);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Các bước trong quy trình vận đơn
  const steps = ['Đang chuẩn bị', 'Đã xác nhận', 'Đang giao hàng', 'Thành công'];

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [orderId]);

  // Component hiển thị Stepper (Thanh trạng thái)
  const renderStepper = () => {
    if (!order) return null;

    // Convert string status to number for stepper
    const statusNumber = getStatusNumber(order.status || 'PENDING');
    const currentStep = statusNumber <= 3 ? statusNumber : 3;

    return (
      <View style={styles.stepperContainer}>
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <View key={index} style={styles.stepItemWrapper}>
              {/* Vòng tròn icon */}
              <View style={styles.stepItem}>
                {isActive ? (
                  <Ionicons name="checkmark-circle" size={32} color={statusNumber === 4 ? "#FB7181" : "#40BFFF"} />
                ) : (
                  <Ionicons name="checkmark-circle-outline" size={32} color="#EBF0FF" />
                )}
                <Text style={[styles.stepLabel, isActive && styles.stepLabelActive, statusNumber === 4 && isActive && { color: '#FB7181' }]}>
                  {step}
                </Text>
              </View>

              {/* Đường kẻ nối (Line) - Không vẽ cho phần tử cuối cùng */}
              {!isLast && (
                <View style={[styles.stepLine, index < currentStep && styles.stepLineActive, statusNumber === 4 && index < currentStep && { backgroundColor: '#FB7181' }]} />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#40BFFF" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Không tìm thấy đơn hàng</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#40BFFF' }}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng #{order.id || ''}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* 2. Stepper Section */}
        {getStatusNumber(order.status || 'PENDING') === 4 ? (
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Ionicons name="close-circle" size={48} color="#FB7181" />
            <Text style={{ color: '#FB7181', fontWeight: '700', marginTop: 8 }}>Đơn hàng đã bị hủy</Text>
            {order.cancelReason && <Text style={{ color: '#9098B1', fontSize: 12, marginTop: 4 }}>Lý do: {order.cancelReason}</Text>}
          </View>
        ) : renderStepper()}

        {/* 3. Product List */}
        <Text style={styles.sectionTitle}>Sản phẩm</Text>
        <View style={styles.productList}>
          {order.orderDetails?.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <Image source={{ uri: item.productImage }} style={styles.productImage} resizeMode="contain" />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.productName}</Text>
                <Text style={styles.productPrice}>{(item.priceBuy || 0).toLocaleString('vi-VN')}đ x {item.quantity}</Text>
              </View>
              <View>
                <Text style={styles.productPrice}>{(item.amount || 0).toLocaleString('vi-VN')}đ</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 4. Shipping Details */}
        <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
        <View style={styles.detailCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Ngày đặt</Text>
            <Text style={styles.value}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Thanh toán</Text>
            <Text style={styles.value}>{order.paymentMethod}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Địa chỉ</Text>
            <Text style={[styles.value, styles.addressValue]}>
              {order.receiverAddress}
            </Text>
          </View>
          {order.note && (
            <View style={styles.row}>
              <Text style={styles.label}>Ghi chú</Text>
              <Text style={styles.value}>{order.note}</Text>
            </View>
          )}
        </View>

        {/* 5. Payment Details */}
        <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
        <View style={styles.detailCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Tạm tính ({order.orderDetails?.length} sản phẩm)</Text>
            <Text style={styles.value}>{(order.subtotal || 0).toLocaleString('vi-VN')}đ</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phí vận chuyển</Text>
            <Text style={styles.value}>{(order.shippingFee || 0).toLocaleString('vi-VN')}đ</Text>
          </View>

          <View style={styles.dashedLine} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalPrice}>{(order.totalAmount || 0).toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

        {getStatusNumber(order.status || 'PENDING') === 0 && (
          <TouchableOpacity style={[styles.notifyButton, { backgroundColor: '#FB7181' }]}>
            <Text style={styles.notifyButtonText}>Hủy đơn hàng</Text>
          </TouchableOpacity>
        )}

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
    flex: 1,
  },
  stepItem: {
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: '#fff',
  },
  stepLabel: {
    fontSize: 10,
    color: '#9098B1',
    marginTop: 8,
    textAlign: 'center',
  },
  stepLabelActive: { color: '#40BFFF' },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#EBF0FF',
    marginBottom: 20,
    marginHorizontal: -10,
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
    width: '90%',
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
    flex: 2,
    textAlign: 'right',
  },
  addressValue: {
    lineHeight: 18,
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

export default OrderDetail;