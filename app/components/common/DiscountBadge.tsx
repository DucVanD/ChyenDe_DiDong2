import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated, ViewStyle, TextStyle } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';

interface DiscountBadgeProps {
    discount: number;
    style?: ViewStyle;
    textStyle?: TextStyle;
    size?: 'sm' | 'md' | 'lg';
}

export const DiscountBadge: React.FC<DiscountBadgeProps> = ({
    discount,
    style,
    textStyle,
    size = 'md'
}) => {
    const animatedValue = useRef(new Animated.Value(0.7)).current;

    useEffect(() => {
        const blink = () => {
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]).start(() => blink());
        };

        blink();
    }, [animatedValue]);

    const badgeStyles = [
        styles.badge,
        size === 'sm' && styles.sm,
        size === 'lg' && styles.lg,
        style,
        { opacity: animatedValue }
    ];

    const badgeTextStyles = [
        styles.text,
        size === 'sm' && styles.textSm,
        size === 'lg' && styles.textLg,
        textStyle,
    ];

    return (
        <Animated.View style={badgeStyles}>
            <Text style={badgeTextStyles}>-{Math.round(discount)}%</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    badge: {
        backgroundColor: Colors.accent.error,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderBottomRightRadius: BorderRadius.md,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        ...Shadows.sm,
    },
    sm: {
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderBottomRightRadius: 4,
    },
    lg: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderBottomRightRadius: BorderRadius.lg,
    },
    text: {
        color: Colors.neutral.white,
        fontWeight: Typography.fontWeight.bold,
        fontSize: 10,
    },
    textSm: {
        fontSize: 8,
    },
    textLg: {
        fontSize: 12,
    },
});

export default DiscountBadge;
