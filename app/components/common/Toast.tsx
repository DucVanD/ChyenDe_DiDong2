/**
 * Toast Notification Component
 * Clean, elegant design inspired by modern UI patterns
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { Colors, Shadows, BorderRadius, Spacing, Typography } from '@/constants/theme';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onHide?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    duration = 2000,
    onHide,
}) => {
    const translateY = useSharedValue(-100);
    const opacity = useSharedValue(0);

    useEffect(() => {
        // Smooth slide in
        translateY.value = withSpring(0, {
            damping: 15,
            stiffness: 100,
        });
        opacity.value = withTiming(1, { duration: 200 });

        // Auto hide
        const timer = setTimeout(() => {
            translateY.value = withTiming(-100, { duration: 200 });
            opacity.value = withTiming(0, { duration: 200 }, () => {
                if (onHide) runOnJS(onHide)();
            });
        }, duration);

        return () => clearTimeout(timer);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'checkmark-circle';
            case 'error':
                return 'close-circle';
            case 'info':
                return 'information-circle';
            case 'warning':
                return 'warning';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'success':
                return Colors.accent.success;
            case 'error':
                return Colors.accent.error;
            case 'info':
                return Colors.accent.info;
            case 'warning':
                return Colors.accent.warning;
        }
    };

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <View style={styles.content}>
                <Ionicons name={getIcon()} size={24} color={getIconColor()} />
                <Text style={styles.message}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: Spacing.base,
        right: Spacing.base,
        zIndex: 9999,
        backgroundColor: Colors.neutral.white,
        borderRadius: BorderRadius.lg,
        ...Shadows.lg,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
        gap: Spacing.md,
    },
    message: {
        flex: 1,
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.neutral.text.primary,
        lineHeight: Typography.lineHeight.normal * Typography.fontSize.base,
    },
});

// Toast Manager for global usage
let toastCallback: ((props: ToastProps) => void) | null = null;

export const setToastCallback = (callback: (props: ToastProps) => void) => {
    toastCallback = callback;
};

export const showToast = (props: Omit<ToastProps, 'onHide'>) => {
    if (toastCallback) {
        toastCallback(props);
    }
};
