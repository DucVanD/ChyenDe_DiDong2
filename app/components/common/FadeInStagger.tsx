import React, { useEffect } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing
} from 'react-native-reanimated';

interface FadeInStaggerProps {
    children: React.ReactNode;
    index: number;
    delay?: number;
    style?: any;
}

export default function FadeInStagger({ children, index, delay = 100, style }: FadeInStaggerProps) {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    useEffect(() => {
        opacity.value = withDelay(
            index * delay,
            withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) })
        );
        translateY.value = withDelay(
            index * delay,
            withTiming(0, { duration: 500, easing: Easing.out(Easing.exp) })
        );
    }, [index, delay]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <Animated.View style={[animatedStyle, style]}>
            {children}
        </Animated.View>
    );
}
