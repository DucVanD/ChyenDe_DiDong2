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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get("window");

export default function SuccessScreen() {
  const router = useRouter();

  // Animation values
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;
  const buttonTranslateYAnim = useRef(new Animated.Value(50)).current;
  const buttonOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Rung thông báo thành công
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.sequence([
      // 1. Icon nảy lên
      Animated.spring(iconScaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      // 2. Chữ và nút hiện ra
      Animated.parallel([
        Animated.timing(textOpacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(buttonTranslateYAnim, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.container}>
        {/* Icon Animation */}
        <Animated.View
          style={[
            styles.iconWrapper,
            { transform: [{ scale: iconScaleAnim }] }
          ]}
        >
          <View style={styles.iconCircle}>
            <LottieView
              source={{ uri: 'https://assets10.lottiefiles.com/packages/lf20_qw8ewi70.json' }} // Success checkmark
              autoPlay
              loop={false}
              style={{ width: 120, height: 120 }}
            />
          </View>
        </Animated.View>

        {/* Text Animation */}
        <Animated.View style={{ opacity: textOpacityAnim, alignItems: 'center' }}>
          <Text style={styles.title}>Đặt hàng thành công!</Text>
          <Text style={styles.subtitle}>
            Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi
          </Text>
        </Animated.View>

        {/* Button Animation */}
        <Animated.View
          style={{
            opacity: buttonOpacityAnim,
            transform: [{ translateY: buttonTranslateYAnim }],
            width: width - 32,
            marginTop: 32,
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
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingBottom: 50,
  },

  // --- ĐÃ SỬA PHẦN NÀY ---
  iconWrapper: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    // Đã xóa shadow ở đây để tránh bị khung vuông
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65, // Bo tròn 1/2 kích thước
    backgroundColor: "#40BFFF",
    alignItems: "center",
    justifyContent: "center",

    // Shadow chuyển vào đây sẽ bo theo hình tròn
    shadowColor: "#40BFFF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,

    // Đã xóa border (viền trắng) theo yêu cầu
  },

  // Text Styles
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#223263",
    marginTop: 8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#9098B1",
    textAlign: "center",
  },

  // Button Styles
  button: {
    backgroundColor: "#40BFFF",
    paddingVertical: 16,
    borderRadius: 5,
    alignItems: "center",
    shadowColor: "#40BFFF",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});