import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
    Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { removePurchasedItems } from '@/services/cart.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function PaymentResultScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const status = params.status as string; // 'success' or 'failed'
    const orderId = params.orderId as string;
    const reason = params.reason as string;

    const isSuccess = status === 'success';

    useEffect(() => {
        if (isSuccess) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Partial clear cart when payment is successful
            const cleanup = async () => {
                try {
                    const keysData = await AsyncStorage.getItem('selected_cart_item_keys');
                    if (keysData) {
                        const keys = JSON.parse(keysData);
                        await removePurchasedItems(keys);
                    }

                    // Clear temporary checkout data and persistent selections
                    await Promise.all([
                        AsyncStorage.removeItem('applied_voucher'),
                        AsyncStorage.removeItem('selected_cart_item_keys'),
                        AsyncStorage.removeItem('cart_selected_items')
                    ]);
                } catch (error) {
                    console.error('Error during partial cart cleanup:', error);
                }
            };

            cleanup();
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    }, [isSuccess]);

    const handleGoHome = () => {
        router.dismissAll();
        router.replace('/');
    };

    const handleRetryPayment = () => {
        // Go back to payment method selection
        router.replace('/paymentMethod');
    };

    if (isSuccess) {
        // Success screen
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />

                <View style={styles.container}>
                    {/* Success Animation */}
                    <View style={styles.iconWrapper}>
                        <View style={styles.iconCircle}>
                            <LottieView
                                source={{ uri: 'https://lottie.host/7663e80f-7c15-46fd-9e96-a00661a3374d/53jYJbB1d6.json' }}
                                autoPlay
                                loop={false}
                                style={{ width: 140, height: 140 }}
                            />
                        </View>
                    </View>

                    {/* Text */}
                    <Text style={styles.title}>Thanh toán thành công!</Text>
                    <Text style={styles.subtitle}>
                        Đơn hàng của bạn đã được thanh toán.{'\n'}
                        Đang chờ xác nhận từ người bán.
                    </Text>

                    {/* Order Info */}
                    {orderId && (
                        <View style={styles.orderInfo}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Mã đơn hàng:</Text>
                                <Text style={styles.detailValue}>#{orderId}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Phương thức:</Text>
                                <Text style={styles.detailValue}>VNPay</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Trạng thái:</Text>
                                <Text style={[styles.detailValue, styles.paidStatus]}>Đã thanh toán</Text>
                            </View>
                        </View>
                    )}

                    {/* Home Button */}
                    <TouchableOpacity style={styles.button} onPress={handleGoHome}>
                        <Text style={styles.buttonText}>Về trang chủ</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    } else {
        // Failed/Cancelled screen
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />

                <View style={styles.container}>
                    {/* Error Icon */}
                    <View style={styles.iconWrapper}>
                        <View style={[styles.iconCircle, styles.errorCircle]}>
                            <Ionicons name="close-circle" size={80} color="#fff" />
                        </View>
                    </View>

                    {/* Text */}
                    <Text style={styles.title}>Thanh toán thất bại</Text>
                    <Text style={styles.subtitle}>
                        {reason || 'Thanh toán đã bị hủy hoặc gặp lỗi.'}
                        {'\n\n'}Đơn hàng đã được hủy và số lượng sản phẩm đã được hoàn lại.
                    </Text>

                    {/* Order Info */}
                    {orderId && (
                        <View style={styles.orderInfo}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Mã đơn hàng:</Text>
                                <Text style={styles.detailValue}>#{orderId}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Trạng thái:</Text>
                                <Text style={[styles.detailValue, styles.cancelledStatus]}>Đã hủy</Text>
                            </View>
                        </View>
                    )}

                    {/* Buttons */}
                    <TouchableOpacity style={styles.button} onPress={handleRetryPayment}>
                        <Text style={styles.buttonText}>Thử lại</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
                        <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    iconWrapper: {
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#40BFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#40BFFF',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 15,
    },
    errorCircle: {
        backgroundColor: '#ef4444',
        shadowColor: '#ef4444',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#223263',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        color: '#9098B1',
        textAlign: 'center',
        marginBottom: 24,
    },
    orderInfo: {
        backgroundColor: '#F6F7FB',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        width: width - 80,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: '#9098B1',
        fontWeight: '600',
    },
    detailValue: {
        fontSize: 14,
        color: '#223263',
        fontWeight: '700',
    },
    paidStatus: {
        color: '#10b981',
        fontWeight: '800',
    },
    cancelledStatus: {
        color: '#ef4444',
        fontWeight: '800',
    },
    button: {
        backgroundColor: '#40BFFF',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#40BFFF',
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
        width: width - 64,
        marginBottom: 12,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 18,
        letterSpacing: 0.5,
    },
    secondaryButton: {
        backgroundColor: '#F6F7FB',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        width: width - 64,
    },
    secondaryButtonText: {
        color: '#9098B1',
        fontWeight: '700',
        fontSize: 16,
    },
});
