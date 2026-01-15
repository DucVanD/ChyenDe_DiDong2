/**
 * Button Component
 * Clean, minimal design with subtle interactions
 */

import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, PressableProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing, Typography } from '@/constants/theme';

interface ButtonProps extends Omit<PressableProps, 'style'> {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    fullWidth?: boolean;
    textColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    fullWidth = false,
    textColor,
    ...props
}) => {
    const getIconColor = () => {
        if (variant === 'primary') return Colors.neutral.white;
        if (variant === 'outline') return Colors.neutral.text.primary;
        return Colors.primary.main;
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.button,
                styles[variant],
                styles[size],
                fullWidth && styles.fullWidth,
                pressed && styles.pressed,
                (disabled || loading) && styles.disabled,
            ]}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={getIconColor()} size="small" />
            ) : (
                <>
                    {icon && <Ionicons name={icon} size={20} color={textColor || getIconColor()} />}
                    <Text style={[
                        styles.buttonText,
                        styles[`${variant}Text`],
                        styles[`${size}Text`],
                        textColor ? { color: textColor } : null
                    ]}>
                        {title}
                    </Text>
                </>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.lg,
        gap: Spacing.sm,
    },

    // Variants
    primary: {
        backgroundColor: Colors.primary.main,
        ...Shadows.md,
    },
    secondary: {
        backgroundColor: Colors.primary.light,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: Colors.neutral.border,
    },

    // Sizes
    sm: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        minHeight: 36,
    },
    md: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        minHeight: 44,
    },
    lg: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.base,
        minHeight: 52,
    },

    // States
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    disabled: {
        opacity: 0.5,
    },
    fullWidth: {
        width: '100%',
    },

    // Text styles
    buttonText: {
        fontWeight: Typography.fontWeight.semibold,
    },
    smText: {
        fontSize: Typography.fontSize.sm,
    },
    mdText: {
        fontSize: Typography.fontSize.base,
    },
    lgText: {
        fontSize: Typography.fontSize.lg,
    },
    primaryText: {
        color: Colors.neutral.white,
    },
    secondaryText: {
        color: Colors.primary.main,
    },
    outlineText: {
        color: Colors.neutral.text.primary,
    },
});
