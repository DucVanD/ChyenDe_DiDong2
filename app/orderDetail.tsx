import { getOrderById, Order, getStatusNumber, cancelOrder } from '@/services/order.service';
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
  Modal,
  TextInput,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { showToast } from './components/common/Toast';
import { Button } from './components/common/Button';

const OrderDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const orderId = Number(id);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Cancellation reasons
  const CANCEL_REASONS = [
    'Muốn thay đổi địa chỉ giao hàng',
    'Muốn thay đổi sản phẩm trong đơn hàng',
    'Tìm được giá rẻ hơn ở chỗ khác',
    'Đổi ý, không muốn mua nữa',
    'Thời gian giao hàng quá lâu',
    'Lý do khác'
  ];

  // Các bước trong quy trình vận đơn (5 trạng thái)
  const steps = ['Chờ xác nhận', 'Đã xác nhận', 'Đang chuẩn bị', 'Đang giao hàng', 'Hoàn thành'];

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

  // Handle cancel order
  const handleCancelOrder = () => {
    const statusNumber = getStatusNumber(order?.status || 'PENDING');

    // Check if order can be cancelled
    if (statusNumber >= 3) { // SHIPPING (3) or later
      showToast({ message: 'Đơn hàng đang giao hoặc đã hoàn thành không thể hủy', type: 'warning' });
      return;
    }

    setShowCancelModal(true);
  };

  // Confirm cancellation
  const confirmCancellation = async () => {
    if (!selectedReason) {
      showToast({ message: 'Vui lòng chọn lý do hủy đơn', type: 'warning' });
      return;
    }

    if (selectedReason === 'Lý do khác' && !customReason.trim()) {
      showToast({ message: 'Vui lòng nhập lý do hủy đơn', type: 'warning' });
      return;
    }

    const reason = selectedReason === 'Lý do khác' ? customReason : selectedReason;

    try {
      setIsCancelling(true);
      await cancelOrder(orderId, reason);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast({ message: 'Đơn hàng đã được hủy', type: 'success' });
      setShowCancelModal(false);

      // Refresh order data
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (error: any) {
      showToast({ message: error.message || 'Không thể hủy đơn hàng', type: 'error' });
    } finally {
      setIsCancelling(false);
    }
  };

  // Component hiển thị Stepper (Thanh trạng thái)
  const renderStepper = () => {
    if (!order) return null;

    // Convert string status to number for stepper
    const statusNumber = getStatusNumber(order.status || 'PENDING');
    const currentStep = statusNumber <= 4 ? statusNumber : 4;

    return (
      <View style={styles.stepperContainer}>
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <View key={index} style={styles.stepItemWrapper}>
              <View style={styles.stepItem}>
                {isActive ? (
                  <Ionicons name="checkmark-circle" size={28} color={statusNumber === 5 ? Colors.accent.error : Colors.primary.main} />
                ) : (
                  <Ionicons name="ellipse-outline" size={28} color={Colors.neutral.border} />
                )}
                <Text style={[styles.stepLabel, isActive && styles.stepLabelActive, statusNumber === 5 && isActive && { color: Colors.accent.error }]}>
                  {step}
                </Text>
              </View>

              {!isLast && (
                <View style={[styles.stepLine, index < currentStep && styles.stepLineActive, statusNumber === 5 && index < currentStep && { backgroundColor: Colors.accent.error }]} />
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
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="search-outline" size={48} color={Colors.neutral.text.tertiary} />
        <Text style={{ marginTop: 16, color: Colors.neutral.text.secondary }}>Không tìm thấy đơn hàng</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24 }}>
          <Text style={{ color: Colors.primary.main, fontWeight: 'bold' }}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.neutral.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* 2. Stepper Section */}
        {getStatusNumber(order.status || 'PENDING') === 5 ? (
          <View style={styles.cancelledStatus}>
            <Ionicons name="close-circle" size={48} color={Colors.accent.error} />
            <Text style={styles.cancelledText}>Đơn hàng đã bị hủy</Text>
            {order.cancelReason && <Text style={styles.cancelledReason}>Lý do: {order.cancelReason}</Text>}
          </View>
        ) : renderStepper()}

        {/* 3. Product List */}
        <Text style={styles.sectionTitle}>Sản phẩm</Text>
        <View style={styles.productList}>
          {order.orderDetails?.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <Image source={{ uri: item.productImage }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.productName}</Text>
                <Text style={styles.productQty}>Số lượng: {item.quantity}</Text>
                <Text style={styles.productPriceBuy}>{(item.priceBuy || 0).toLocaleString('vi-VN')}đ</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 4. Shipping Details */}
        <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
        <View style={styles.detailCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Ngày đặt</Text>
            <Text style={styles.value}>
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '-'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Giờ đặt</Text>
            <Text style={styles.value}>
              {order.createdAt ? new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '-'}
            </Text>
          </View>

          {order.completedAt && getStatusNumber(order.status || '') === 4 && (
            <View style={styles.row}>
              <Text style={styles.label}>Ngày giao thành công</Text>
              <Text style={[styles.value, { color: Colors.accent.success, fontWeight: '700' }]}>
                {new Date(order.completedAt).toLocaleDateString('vi-VN')} {new Date(order.completedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}

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

          {order.discountAmount > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Giảm giá {order.voucherCode ? `(${order.voucherCode})` : ''}</Text>
              <Text style={[styles.value, { color: Colors.accent.success, fontWeight: '700' }]}>
                -{(order.discountAmount || 0).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          )}

          <View style={styles.dashedLine} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalPrice}>{(order.totalAmount || 0).toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

        {/* Refund Notification for cancelled VNPay orders */}
        {getStatusNumber(order.status || 'PENDING') === 5 &&
          order.paymentMethod === 'VNPAY' && (
            <View style={styles.refundNotice}>
              <Ionicons name="information-circle" size={20} color={Colors.accent.warning} />
              <Text style={styles.refundText}>
                Tiền sẽ được hoàn lại vào tài khoản của bạn trong vòng 24 giờ
              </Text>
            </View>
          )}

        {/* Cancel button - Show for PENDING (0), CONFIRMED (1), PREPARING (2) only */}
        {(getStatusNumber(order.status || 'PENDING') === 0 ||
          getStatusNumber(order.status || 'PENDING') === 1 ||
          getStatusNumber(order.status || 'PENDING') === 2) && (
            <View style={{ marginTop: Spacing.lg }}>
              <Button
                title="Hủy đơn hàng"
                variant="outline"
                onPress={handleCancelOrder}
                fullWidth
              />
            </View>
          )}

      </ScrollView>

      {/* Cancellation Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lý do hủy đơn hàng</Text>

            <ScrollView style={styles.reasonList}>
              {CANCEL_REASONS.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.reasonItem}
                  onPress={() => setSelectedReason(reason)}
                >
                  <Ionicons
                    name={selectedReason === reason ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color={selectedReason === reason ? Colors.primary.main : Colors.neutral.border}
                  />
                  <Text style={[
                    styles.reasonText,
                    selectedReason === reason && styles.reasonTextActive
                  ]}>
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Custom reason input */}
            {selectedReason === 'Lý do khác' && (
              <TextInput
                style={styles.customReasonInput}
                placeholder="Nhập lý do hủy đơn..."
                placeholderTextColor={Colors.neutral.text.tertiary}
                value={customReason}
                onChangeText={setCustomReason}
                multiline
                numberOfLines={3}
              />
            )}

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <View style={{ flex: 1 }}>
                <Button
                  title="Đóng"
                  variant="outline"
                  onPress={() => {
                    setShowCancelModal(false);
                    setSelectedReason('');
                    setCustomReason('');
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Button
                  title={isCancelling ? 'Đang hủy...' : 'Xác nhận'}
                  variant="primary"
                  onPress={confirmCancellation}
                  disabled={isCancelling}
                  loading={isCancelling}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
    backgroundColor: Colors.neutral.white,
  },
  headerTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  backButton: { padding: 4 },
  scrollContent: { padding: Spacing.base, paddingBottom: Spacing["2xl"] },

  // --- Stepper Styles ---
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.sm,
  },
  stepItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepItem: {
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: Colors.neutral.white,
  },
  stepLabel: {
    fontSize: 9,
    color: Colors.neutral.text.tertiary,
    marginTop: 6,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: Colors.primary.main,
    fontWeight: Typography.fontWeight.semibold,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.neutral.bg,
    marginBottom: 16,
    marginHorizontal: -8,
    zIndex: -1,
  },
  stepLineActive: { backgroundColor: Colors.primary.main },

  // --- Cancelled Status ---
  cancelledStatus: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    backgroundColor: Colors.accent.error + '10',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  cancelledText: {
    color: Colors.accent.error,
    fontWeight: Typography.fontWeight.bold,
    marginTop: 8,
    fontSize: Typography.fontSize.base,
  },
  cancelledReason: {
    color: Colors.neutral.text.secondary,
    fontSize: Typography.fontSize.sm,
    marginTop: 4,
  },

  // --- Section Common ---
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.base,
  },

  // --- Product Card ---
  productList: { gap: Spacing.base },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.bg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.base,
    backgroundColor: Colors.neutral.white,
  },
  productInfo: { flex: 1 },
  productName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral.text.primary,
    marginBottom: 4,
  },
  productQty: {
    fontSize: Typography.fontSize.xs,
    color: Colors.neutral.text.secondary,
  },
  productPriceBuy: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
    marginTop: 2,
  },

  // --- Detail Card (Shipping & Payment) ---
  detailCard: {
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.secondary,
    flex: 1,
  },
  value: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.primary,
    flex: 2,
    textAlign: 'right',
    fontWeight: Typography.fontWeight.medium,
  },
  addressValue: {
    lineHeight: 20,
  },
  dashedLine: {
    height: 1,
    backgroundColor: Colors.neutral.border,
    marginBottom: Spacing.md,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  totalPrice: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
  },

  // --- Refund Notice ---
  refundNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent.warning + '10',
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent.warning,
    padding: Spacing.base,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
  },
  refundText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.primary,
    marginLeft: 12,
    lineHeight: 20,
  },

  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  reasonList: {
    maxHeight: 300,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.bg,
  },
  reasonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.neutral.text.primary,
    marginLeft: 12,
    flex: 1,
  },
  reasonTextActive: {
    color: Colors.primary.main,
    fontWeight: Typography.fontWeight.semibold,
  },
  customReasonInput: {
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginTop: Spacing.base,
    fontSize: Typography.fontSize.base,
    color: Colors.neutral.text.primary,
    backgroundColor: Colors.neutral.bg,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    gap: Spacing.base,
  },
});

export default OrderDetail;