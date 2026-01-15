import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";

const { width, height } = Dimensions.get("window");

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get order info from params
  const orderId = params.orderId as string;
  const amount = params.amount as string;
  const paymentMethod = params.paymentMethod as string;

  // Format currency
  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(num);
  };

  // Animation values
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;
  const buttonTranslateYAnim = useRef(new Animated.Value(50)).current;
  const buttonOpacityAnim = useRef(new Animated.Value(0)).current;

  // Particles for "wow" effect
  const particles = useRef([...Array(12)].map(() => ({
    x: new Animated.Value(width / 2),
    y: new Animated.Value(height / 2),
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0),
  }))).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Initial sequence
    Animated.sequence([
      Animated.delay(200),
      Animated.spring(iconScaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(textOpacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(buttonTranslateYAnim, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    ]).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        })
      ])
    ).start();

    // Trigger particles
    particles.forEach((p, i) => {
      const angle = (i / particles.length) * Math.PI * 2;
      const dist = 60 + Math.random() * 100;

      Animated.sequence([
        Animated.delay(500 + i * 20),
        Animated.parallel([
          Animated.timing(p.opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(p.scale, { toValue: Math.random() * 0.8 + 0.4, duration: 400, useNativeDriver: true }),
          Animated.spring(p.x, {
            toValue: width / 2 + Math.cos(angle) * dist,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.spring(p.y, {
            toValue: height / 2.5 + Math.sin(angle) * dist,
            friction: 4,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: 1000,
          delay: 500,
          useNativeDriver: true,
        })
      ]).start();
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.container}>
        {/* Decorative Particles */}
        {particles.map((p, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                transform: [
                  { translateX: p.x },
                  { translateY: p.y },
                  { scale: p.scale }
                ],
                opacity: p.opacity,
                backgroundColor: i % 2 === 0 ? Colors.primary.main : Colors.accent.error,
              }
            ]}
          />
        ))}

        {/* Pulse Effect */}
        <Animated.View
          style={[
            styles.pulse,
            {
              transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] }) }],
              opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0] }),
            }
          ]}
        />
        <Animated.View
          style={[
            styles.pulse,
            {
              transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.8, 2] }) }],
              opacity: pulseAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.2, 0] }),
            }
          ]}
        />

        {/* Icon Area */}
        <Animated.View
          style={[
            styles.iconWrapper,
            { transform: [{ scale: iconScaleAnim }] }
          ]}
        >
          <View style={styles.iconCircle}>
            <LottieView
              source={{ uri: 'https://lottie.host/7663e80f-7c15-46fd-9e96-a00661a3374d/53jYJbB1d6.json' }}
              autoPlay
              loop={false}
              style={{ width: 140, height: 140 }}
            />
          </View>
        </Animated.View>

        {/* Text Area */}
        <Animated.View style={{ opacity: textOpacityAnim, alignItems: 'center', zIndex: 10 }}>
          <Text style={styles.title}>Thanh công!</Text>
          <Text style={styles.subtitle}>
            {paymentMethod === 'VNPay'
              ? 'Đơn hàng đã thanh toán thành công!\nĐang chờ xác nhận từ người bán.'
              : 'Đơn hàng của bạn đang được xử lý.\nBạn sẽ thanh toán khi nhận hàng.'
            }
          </Text>

          {/* Order Details */}
          {orderId && (
            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mã đơn hàng:</Text>
                <Text style={styles.detailValue}>#{orderId}</Text>
              </View>
              {amount && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tổng tiền:</Text>
                  <Text style={[styles.detailValue, styles.amountText]}>
                    {formatCurrency(amount)}
                  </Text>
                </View>
              )}
              {paymentMethod && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phương thức:</Text>
                  <Text style={styles.detailValue}>{paymentMethod}</Text>
                </View>
              )}
              {paymentMethod === 'VNPay' && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Trạng thái:</Text>
                  <Text style={[styles.detailValue, styles.paidStatus]}>Đã thanh toán</Text>
                </View>
              )}
            </View>
          )}
        </Animated.View>

        {/* Home Button */}
        <Animated.View
          style={{
            opacity: buttonOpacityAnim,
            transform: [{ translateY: buttonTranslateYAnim }],
            width: width - 64,
            marginTop: 48,
          }}
        >
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => {
              router.dismissAll();
              router.replace("/");
            }}
          >
            <Text style={styles.buttonText}>Về trang chủ</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  pulse: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary.main,
    top: height / 2.5 - 60,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    left: -4,
    top: -4,
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
    backgroundColor: Colors.primary.main,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    lineHeight: 24,
    color: Colors.neutral.text.secondary,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.primary.main,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    shadowColor: Colors.primary.main,
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  buttonText: {
    color: Colors.neutral.white,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.lg,
    letterSpacing: 0.5,
  },
  orderDetails: {
    backgroundColor: Colors.neutral.bg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
    width: width - 80,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  detailValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral.text.primary,
    fontWeight: Typography.fontWeight.bold,
  },
  amountText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary.main,
  },
  paidStatus: {
    color: Colors.accent.success,
    fontWeight: Typography.fontWeight.bold,
  },
});