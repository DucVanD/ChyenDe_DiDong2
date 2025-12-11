import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Dữ liệu mẫu
const ordersData = [
  {
    id: '1',
    orderCode: 'LQNSU346JK',
    orderDate: 'August 1, 2017',
    status: 'Shipping',
    itemsCount: 2,
    price: '$299,43',
  },
  {
    id: '2',
    orderCode: 'SDG1345KJD',
    orderDate: 'August 1, 2017',
    status: 'Shipping',
    itemsCount: 1,
    price: '$299,43',
  },
  {
    id: '3',
    orderCode: 'QWES1234AD',
    orderDate: 'August 2, 2017',
    status: 'Arriving',
    itemsCount: 3,
    price: '$150,00',
  },
];

const OrderS = () => {
  const router = useRouter();

  const renderOrderItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.orderCard}
        // --- PHẦN SỬA ĐỔI Ở ĐÂY ---
        onPress={() => {
            // Chuyển hướng sang màn hình OrderDetail
            // Lưu ý: Đảm bảo bạn đã tạo file 'app/orderDetail.js'
            router.push("/orderDetail"); 
        }}
        // ---------------------------
      >
        <Text style={styles.orderCode}>{item.orderCode}</Text>
        <Text style={styles.orderDate}>Order at E-comm : {item.orderDate}</Text>

        <View style={styles.dashedLine} />

        <View style={styles.rowDetail}>
          <Text style={styles.label}>Order Status</Text>
          <Text style={styles.valueText}>{item.status}</Text>
        </View>

        <View style={styles.rowDetail}>
          <Text style={styles.label}>Items</Text>
          <Text style={styles.valueText}>{item.itemsCount} Items purchased</Text>
        </View>

        <View style={styles.rowDetail}>
          <Text style={styles.label}>Price</Text>
          <Text style={styles.priceValue}>{item.price}</Text>
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
        <Text style={styles.headerTitle}>Order</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <FlatList
        data={ordersData}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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