import { getMyOrders, Order, getStatusNumber } from '@/services/order.service';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

const STATUS_MAP: { [key: number]: { label: string, color: string, bg: string } } = {
  0: { label: 'Chờ xác nhận', color: '#F59E0B', bg: '#FEF3C7' },
  1: { label: 'Đã xác nhận', color: Colors.primary.main, bg: Colors.primary.light },
  2: { label: 'Đang chuẩn bị', color: '#8B5CF6', bg: '#EDE9FE' },
  3: { label: 'Đang giao hàng', color: '#3B82F6', bg: '#DBEAFE' },
  4: { label: 'Đã hoàn thành', color: Colors.accent.success, bg: '#DCFCE7' },
  5: { label: 'Đã hủy', color: Colors.accent.error, bg: '#FEE2E2' },
};

const OrderS = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getMyOrders(0, { size: 50 });
        setOrders(response.data?.orders || []);
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }: { item: Order }) => {
    const statusNumber = getStatusNumber(item.status || 'PENDING');
    const statusInfo = STATUS_MAP[statusNumber] || { label: 'Không xác định', color: Colors.neutral.text.tertiary, bg: Colors.neutral.bg };

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => {
          Haptics.selectionAsync();
          router.push({
            pathname: "/orderDetail",
            params: { id: item.id }
          });
        }}
      >
        <View style={styles.orderCardHeader}>
          <Text style={styles.orderCode}>Mã ĐH: #{item.id || ''}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Text style={[styles.statusLabel, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <Text style={styles.orderDate}>
          <Ionicons name="time-outline" size={14} color={Colors.neutral.text.tertiary} /> {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '-'}
        </Text>

        <View style={styles.separator} />

        <View style={styles.orderDetails}>
          <View style={styles.rowDetail}>
            <Text style={styles.label}>Sản phẩm</Text>
            <Text style={styles.valueText}>{item.orderDetails?.length || 0} sản phẩm</Text>
          </View>
          <View style={styles.rowDetail}>
            <Text style={styles.label}>Tổng tiền</Text>
            <Text style={styles.priceValue}>{(item.totalAmount || 0).toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

        <View style={styles.orderCardFooter}>
          <Text style={styles.viewDetailText}>Xem chi tiết</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.primary.main} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.neutral.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary.main} />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => (item.id || '').toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="bag-outline" size={48} color={Colors.neutral.text.tertiary} />
              </View>
              <Text style={styles.emptyTitle}>Chưa có đơn hàng</Text>
              <Text style={styles.emptySubtitle}>Bạn chưa thực hiện bất kỳ giao dịch nào</Text>
            </View>
          }
        />
      )}
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
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  backButton: {
    padding: 4,
  },
  listContainer: {
    padding: Spacing.base,
  },

  // Order Card
  orderCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadows.md,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderCode: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  orderDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.neutral.text.tertiary,
    marginBottom: Spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.neutral.bg,
    marginBottom: Spacing.md,
  },
  orderDetails: {
    gap: 8,
  },
  rowDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.secondary,
  },
  valueText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  priceValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
  },
  orderCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Spacing.base,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.bg,
  },
  viewDetailText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
    marginRight: 4,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: Spacing.xl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.neutral.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.neutral.text.secondary,
    textAlign: 'center',
  },
});

export default OrderS;