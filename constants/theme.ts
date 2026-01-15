/**
 * Clean & Elegant Design System
 * Phong cách: Minimalist, không flashy, tập trung vào subtle details
 */

export const Colors = {
    // Primary - Soft Blue (không chói)
    primary: {
        main: '#4A90E2',
        light: '#E8F4FD',
        dark: '#2E5C8A',
    },

    // Neutrals - Clean grays
    neutral: {
        white: '#FFFFFF',
        bg: '#F8F9FA',
        border: '#E5E7EB',
        text: {
            primary: '#1F2937',
            secondary: '#6B7280',
            tertiary: '#9CA3AF',
        },
    },

    // Accent - Subtle, not loud
    accent: {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
    },

    // Discount - Elegant red
    discount: '#DC2626',

    // Rating
    star: '#FBBF24',
};

export const Typography = {
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 28,
    },

    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },

    fontWeight: {
        normal: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
};

export const Shadows = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },

    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },

    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },

    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
};

export const BorderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
};

export const AnimationTiming = {
    fast: 200,
    normal: 300,
    slow: 500,
};
