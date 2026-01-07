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

const STATUS_MAP: { [key: number]: { label: string, color: string } } = {
  0: { label: 'Chờ xác nhận', color: '#FFC107' },
  1: { label: 'Đã xác nhận', color: '#40BFFF' },
  2: { label: 'Đang giao hàng', color: '#5C61F4' },
  3: { label: 'Đã hoàn thành', color: '#53D1B6' },
  4: { label: 'Đã hủy', color: '#FB7181' },
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
    const statusInfo = STATUS_MAP[statusNumber] || { label: 'Không xác định', color: '#9098B1' };

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => {
          router.push({
            pathname: "/orderDetail",
            params: { id: item.id }
          });
        }}
      >
        <Text style={styles.orderCode}>Mã ĐH: #{item.id || ''}</Text>
        <Text style={styles.orderDate}>Ngày đặt: {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '-'}</Text>

        <View style={styles.dashedLine} />

        <View style={styles.rowDetail}>
          <Text style={styles.label}>Trạng thái</Text>
          <Text style={[styles.valueText, { color: statusInfo.color, fontWeight: '700' }]}>{statusInfo.label}</Text>
        </View>

        <View style={styles.rowDetail}>
          <Text style={styles.label}>Sản phẩm</Text>
          <Text style={styles.valueText}>{item.orderDetails?.length || 0} sản phẩm</Text>
        </View>

        <View style={styles.rowDetail}>
          <Text style={styles.label}>Tổng tiền</Text>
          <Text style={styles.priceValue}>{(item.totalAmount || 0).toLocaleString('vi-VN')}đ</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#40BFFF" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => (item.id || '').toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Ionicons name="bag-outline" size={64} color="#EBF0FF" />
              <Text style={{ color: '#9098B1', marginTop: 16 }}>Bạn chưa có đơn hàng nào</Text>
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
  backButton: {
    padding: 4,
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBF0FF',
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#9098B1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  orderCode: {
    fontSize: 14,
    fontWeight: '700',
    color: '#223263',
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 12,
    color: '#9098B1',
    marginBottom: 12,
  },
  dashedLine: {
    height: 1,
    borderWidth: 1,
    borderColor: '#EBF0FF',
    borderStyle: 'dashed',
    marginBottom: 12,
    borderRadius: 1,
  },
  rowDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#9098B1',
  },
  valueText: {
    fontSize: 12,
    color: '#223263',
  },
  priceValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#40BFFF',
  },
});

export default OrderS;