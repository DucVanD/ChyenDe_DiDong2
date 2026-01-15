import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getOrderById } from '@/services/order.service';


export default function PaymentPendingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const orderId = params.orderId as string;
    const amount = params.amount as string;

    const [isChecking, setIsChecking] = useState(false);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Polling function to check order status
    const checkOrderStatus = async () => {
        if (isChecking) return; // Prevent multiple simultaneous checks

        try {
            setIsChecking(true);
            const order = await getOrderById(parseInt(orderId));

            console.log('📊 Checking order status:', order.status, 'Payment:', order.paymentStatus);

            // Check if payment is completed
            if (order.paymentStatus === 'PAID') {
                // Payment successful
                console.log('✅ Payment successful, redirecting...');
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                }

                router.replace({
                    pathname: '/payment/result',
                    params: {
                        status: 'success',
                        orderId: orderId,
                    }
                });
                return;
            }

            // Check if order is cancelled
            if (order.status === 'CANCELLED') {
                // Payment cancelled or failed
                console.log('❌ Payment cancelled, redirecting...');
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                }

                router.replace({
                    pathname: '/payment/result',
                    params: {
                        status: 'failed',
                        orderId: orderId,
                        reason: order.cancelReason || 'Thanh toán đã bị hủy',
                    }
                });
                return;
            }

        } catch (error) {
            console.error('Error checking order status:', error);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        // Start polling immediately
        checkOrderStatus();

        // Then poll every 3 seconds
        pollingIntervalRef.current = setInterval(() => {
            checkOrderStatus();
        }, 3000); // Check every 3 seconds

        // Cleanup on unmount
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [orderId]);


    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={styles.container}>
                {/* Loading Animation */}
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#40BFFF" />
                    <View style={styles.pulseCircle} />
                </View>

                {/* Title */}
                <Text style={styles.title}>Đang chờ thanh toán...</Text>

                {/* Description */}
                <Text style={styles.description}>
                    Vui lòng hoàn tất thanh toán trên trang VNPay.{'\n'}
                    Sau khi thanh toán xong, bạn sẽ được chuyển về ứng dụng tự động.
                </Text>

                {/* Order Info */}
                {orderId && (
                    <View style={styles.orderInfo}>
                        <Ionicons name="receipt-outline" size={20} color="#9098B1" />
                        <Text style={styles.orderText}>Mã đơn hàng: #{orderId}</Text>
                    </View>
                )}

                {/* Warning Box */}
                <View style={styles.warningBox}>
                    <Ionicons name="warning" size={24} color="#f59e0b" />
                    <Text style={styles.warningText}>
                        Nếu muốn hủy đơn hàng, vui lòng bấm "Hủy đơn hàng" trên trang thanh toán VNPay.
                    </Text>
                </View>

                {/* Instructions */}
                <View style={styles.instructionsContainer}>
                    <View style={styles.instructionItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        <Text style={styles.instructionText}>
                            Nếu thanh toán thành công, bạn sẽ thấy thông báo xác nhận
                        </Text>
                    </View>
                    <View style={styles.instructionItem}>
                        <Ionicons name="close-circle" size={20} color="#ef4444" />
                        <Text style={styles.instructionText}>
                            Nếu hủy thanh toán, bạn có thể chọn phương thức khác
                        </Text>
                    </View>
                </View>


                {/* Back to Home */}
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => router.replace('/')}
                >
                    <Text style={styles.homeButtonText}>Về trang chủ</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
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
    loadingContainer: {
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    pulseCircle: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#40BFFF',
        opacity: 0.1,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#223263',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#9098B1',
        textAlign: 'center',
        marginBottom: 24,
    },
    orderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F7FB',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 24,
    },
    orderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#223263',
        marginLeft: 8,
    },
    instructionsContainer: {
        width: '100%',
        backgroundColor: '#F6F7FB',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef3c7',
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    warningText: {
        flex: 1,
        fontSize: 14,
        color: '#92400e',
        marginLeft: 12,
        lineHeight: 20,
        fontWeight: '600',
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    instructionText: {
        flex: 1,
        fontSize: 14,
        color: '#223263',
        marginLeft: 12,
        lineHeight: 20,
    },
    homeButton: {
        backgroundColor: '#40BFFF',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    homeButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
