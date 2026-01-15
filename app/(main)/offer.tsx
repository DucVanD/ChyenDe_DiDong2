import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Clipboard,
  TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { getActiveVouchers, Voucher } from "@/services/voucher.service";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";
import { showToast } from "@/app/components/common/Toast";
import * as Haptics from 'expo-haptics';

const SAVED_VOUCHERS_KEY = 'saved_vouchers';

export default function OfferScreen() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedVoucherIds, setSavedVoucherIds] = useState<number[]>([]);

  useEffect(() => {
    loadVouchers();
    loadSavedVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const data = await getActiveVouchers();
      setVouchers(data);
    } catch (error) {
      console.error("Error loading vouchers:", error);
      showToast({ message: "Không thể tải danh sách ưu đãi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loadSavedVouchers = async () => {
    try {
      const saved = await AsyncStorage.getItem(SAVED_VOUCHERS_KEY);
      if (saved) {
        setSavedVoucherIds(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading saved vouchers:", error);
    }
  };

  const toggleSaveVoucher = async (voucherId: number) => {
    try {
      let newSavedIds: number[];
      if (savedVoucherIds.includes(voucherId)) {
        newSavedIds = savedVoucherIds.filter(id => id !== voucherId);
      } else {
        newSavedIds = [...savedVoucherIds, voucherId];
      }
      setSavedVoucherIds(newSavedIds);
      await AsyncStorage.setItem(SAVED_VOUCHERS_KEY, JSON.stringify(newSavedIds));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      showToast({
        message: savedVoucherIds.includes(voucherId) ? "Đã gỡ voucher" : "Đã lưu voucher",
        type: "success"
      });
    } catch (error) {
      console.error("Error saving voucher:", error);
    }
  };

  const copyVoucherCode = (code: string) => {
    Clipboard.setString(code);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast({ message: `Mã "${code}" đã được sao chép`, type: "success" });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getDiscountText = (voucher: Voucher) => {
    if (voucher.discountType === 'PERCENTAGE') {
      return `${voucher.discountValue}%`;
    } else {
      return formatCurrency(voucher.discountValue);
    }
  };

  const getRemainingVouchers = (voucher: Voucher) => {
    return voucher.usageLimit - voucher.usedCount;
  };

  const getGradientColors = (index: number): [string, string] => {
    const gradients: [string, string][] = [
      ['#667EEA', '#764BA2'],
      ['#F093FB', '#F5576C'],
      ['#4FACFE', '#00F2FE'],
      ['#43E97B', '#38F9D7'],
      ['#FA709A', '#FEE140'],
      ['#30CFD0', '#330867'],
    ];
    return gradients[index % gradients.length];
  };

  const renderVoucherCard = (voucher: Voucher, index: number) => {
    const isSaved = savedVoucherIds.includes(voucher.id);
    const remaining = getRemainingVouchers(voucher);
    const isPercentage = voucher.discountType === 'PERCENTAGE';

    return (
      <View key={voucher.id} style={styles.voucherCard}>
        <View style={styles.voucherLeft}>
          <Text style={styles.discountValue}>
            {isPercentage ? `${voucher.discountValue}%` : 'GIẢM'}
          </Text>
          {!isPercentage && (
            <Text style={styles.fixedAmount}>
              {voucher.discountValue >= 1000 ? `${voucher.discountValue / 1000}k` : voucher.discountValue}
            </Text>
          )}
          <Text style={styles.offLabel}>GIẢM GIÁ</Text>
        </View>

        <View style={styles.voucherRight}>
          <View style={styles.voucherMainInfo}>
            <Text style={styles.voucherName} numberOfLines={1}>{voucher.voucherCode}</Text>
            <TouchableOpacity
              onPress={() => toggleSaveVoucher(voucher.id)}
              style={styles.saveBtn}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isSaved ? Colors.primary.main : Colors.neutral.text.tertiary}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.voucherDesc} numberOfLines={2}>
            {voucher.description || `Giảm ${getDiscountText(voucher)} cho đơn từ ${formatCurrency(voucher.minOrderAmount)}`}
          </Text>

          <View style={styles.voucherFooter}>
            <View style={styles.expiryBox}>
              <Ionicons name="time-outline" size={12} color={Colors.neutral.text.tertiary} />
              <Text style={styles.expiryText}>HSD: {formatDate(voucher.endDate)}</Text>
            </View>
            <TouchableOpacity
              onPress={() => copyVoucherCode(voucher.voucherCode)}
              style={styles.useBtn}
            >
              <Text style={styles.useBtnText}>Dùng ngay</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Semi-circle cutouts */}
        <View style={styles.cutoutTop} />
        <View style={styles.cutoutBottom} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ưu Đãi Đặc Biệt</Text>
        <Text style={styles.headerSubtitle}>
          {vouchers.length} mã giảm giá đang hoạt động
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary.main} />
            <Text style={styles.loadingText}>Đang tìm ưu đãi tốt nhất cho bạn...</Text>
          </View>
        ) : vouchers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons name="ticket-percent-outline" size={64} color={Colors.neutral.text.tertiary} />
            </View>
            <Text style={styles.emptyText}>Chưa có ưu đãi nào</Text>
            <Text style={styles.emptySubtext}>Vui lòng quay lại sau nhé!</Text>
          </View>
        ) : (
          <>
            {/* Voucher List */}
            <View style={styles.voucherList}>
              <Text style={styles.sectionTitle}>Tất cả ưu đãi dành cho bạn</Text>
              {vouchers.map((voucher, index) => renderVoucherCard(voucher, index))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.bg,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    minHeight: 68,
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.secondary,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: Spacing.base,
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: Spacing["2xl"],
  },
  emptyIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  emptyText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.secondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  voucherList: {
    marginTop: Spacing.base,
    paddingHorizontal: Spacing.base,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    marginBottom: Spacing.base,
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.sm,
  },
  voucherCard: {
    flexDirection: 'row',
    marginBottom: Spacing.base,
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.lg,
    minHeight: 100,
    ...Shadows.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  voucherLeft: {
    width: 100,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  discountValue: {
    fontSize: 24,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.white,
  },
  fixedAmount: {
    fontSize: 18,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.white,
    marginTop: -4,
  },
  offLabel: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.medium,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    letterSpacing: 1,
  },
  voucherRight: {
    flex: 1,
    padding: Spacing.base,
    justifyContent: 'space-between',
  },
  voucherMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  voucherName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    flex: 1,
  },
  saveBtn: {
    padding: 4,
  },
  voucherDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.neutral.text.secondary,
    lineHeight: 16,
    marginBottom: Spacing.sm,
  },
  voucherFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  expiryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expiryText: {
    fontSize: 10,
    color: Colors.neutral.text.tertiary,
  },
  useBtn: {
    backgroundColor: Colors.primary.light,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  useBtnText: {
    fontSize: 11,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
  },
  cutoutTop: {
    position: 'absolute',
    top: -8,
    left: 92,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.neutral.bg,
  },
  cutoutBottom: {
    position: 'absolute',
    bottom: -8,
    left: 92,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.neutral.bg,
  },
});
