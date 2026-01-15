import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Image,
    Dimensions,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { sendChatMessage, ChatMessage } from '@/services/chat.service';
import { getStoredUser } from '@/services/auth.service';
import { useRouter } from 'expo-router';
import { Colors, Shadows, Spacing, BorderRadius, Typography } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function ChatScreen() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            message: 'Xin chào! Tôi là trợ lý AI của cửa hàng. Tôi có thể giúp gì cho bạn? 😊',
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const router = useRouter();
    const typingDots = useRef(new Animated.Value(0)).current;

    // Typing animation
    useEffect(() => {
        if (isLoading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(typingDots, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(typingDots, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            typingDots.setValue(0);
        }
    }, [isLoading]);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            message: inputText,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const user = await getStoredUser();
            const userId = user?.id;

            const history = messages.slice(-5).map(msg => ({
                role: (msg.isUser ? 'user' : 'model') as 'user' | 'model',
                content: msg.message
            }));

            const response = await sendChatMessage(inputText, userId, history);

            const botMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                message: response.message,
                isUser: false,
                timestamp: new Date(),
                products: response.products,
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                message: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau. 😔',
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    const renderMessage = ({ item }: { item: ChatMessage }) => (
        <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.botMessage]}>
            {item.isUser ? (
                <LinearGradient
                    colors={[Colors.primary.main, Colors.primary.dark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.userBubble}
                >
                    <Text style={styles.userText}>{item.message}</Text>
                </LinearGradient>
            ) : (
                <View style={[styles.botBubble, Shadows.sm]}>
                    <View style={styles.botHeader}>
                        <MaterialCommunityIcons name="robot" size={16} color={Colors.primary.main} />
                        <Text style={styles.botLabel}>AI ASSISTANT</Text>
                    </View>
                    <Text style={styles.botText}>{item.message}</Text>
                </View>
            )}

            {/* Product suggestions */}
            {item.products && item.products.length > 0 && (
                <View style={styles.productsContainer}>
                    {item.products.map((product, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.productCard}
                            onPress={() => router.push(`/detail?id=${product.id}`)}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#40BFFF15', '#667EEA15']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.productGradientBorder}
                            >
                                <View style={styles.productContent}>
                                    <Image
                                        source={{ uri: product.image }}
                                        style={styles.productImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productName} numberOfLines={2}>
                                            {product.name}
                                        </Text>
                                        <View style={styles.priceContainer}>
                                            {product.discountPrice && product.discountPrice < product.salePrice && (
                                                <Text style={styles.originalPrice}>
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }).format(product.salePrice)}
                                                </Text>
                                            )}
                                            <LinearGradient
                                                colors={product.discountPrice && product.discountPrice < product.salePrice ? [Colors.accent.error, Colors.primary.dark] : [Colors.primary.main, Colors.primary.dark]}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                style={styles.priceGradient}
                                            >
                                                <Text style={styles.productPrice}>
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }).format(product.discountPrice || product.salePrice)}
                                                </Text>
                                            </LinearGradient>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#9098B1" />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <Text style={[styles.timestamp, item.isUser && styles.userTimestamp]}>
                {item.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            {/* Header with Gradient */}
            <LinearGradient
                colors={[Colors.primary.main, Colors.primary.dark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <View style={styles.avatarContainer}>
                        <MaterialCommunityIcons name="robot" size={28} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>AI Trợ lý mua sắm</Text>
                        <View style={styles.statusIndicator}>
                            <View style={styles.onlineDot} />
                            <Text style={styles.statusText}>Đang hoạt động</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            {/* Messages with gradient background */}
            <View style={[styles.messagesBackground, { backgroundColor: Colors.neutral.bg }]}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {/* Typing indicator */}
            {isLoading && (
                <View style={styles.typingContainer}>
                    <View style={styles.typingBubble}>
                        <Animated.View style={[styles.typingDot, { opacity: typingDots }]} />
                        <Animated.View style={[styles.typingDot, { opacity: typingDots, marginLeft: 4 }]} />
                        <Animated.View style={[styles.typingDot, { opacity: typingDots, marginLeft: 4 }]} />
                    </View>
                    <Text style={styles.typingText}>AI đang suy nghĩ...</Text>
                </View>
            )}

            {/* Input Area */}
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Nhập tin nhắn..."
                        placeholderTextColor="#9098B1"
                        multiline
                        maxLength={500}
                    />
                    <Text style={styles.charCounter}>{inputText.length}/500</Text>
                </View>
                <TouchableOpacity
                    style={styles.sendButtonWrapper}
                    onPress={handleSend}
                    disabled={!inputText.trim() || isLoading}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={inputText.trim() && !isLoading ? [Colors.primary.main, Colors.primary.dark] : [Colors.neutral.border, Colors.neutral.border]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.sendButton}
                    >
                        <Ionicons name="send" size={20} color={Colors.neutral.white} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F7FB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        ...Shadows.sm,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.full,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm,
    },
    headerTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.neutral.white,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.accent.success,
        marginRight: 6,
    },
    statusText: {
        fontSize: Typography.fontSize.xs,
        color: Colors.neutral.white,
        opacity: 0.9,
    },
    messagesBackground: {
        flex: 1,
    },
    messagesList: {
        padding: 16,
    },
    messageContainer: {
        marginBottom: 20,
        maxWidth: '85%',
    },
    userMessage: {
        alignSelf: 'flex-end',
    },
    botMessage: {
        alignSelf: 'flex-start',
    },
    userBubble: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderBottomRightRadius: 4,
        ...Shadows.md,
    },
    botBubble: {
        backgroundColor: Colors.neutral.white,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: Colors.neutral.border,
    },
    botHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    botLabel: {
        fontSize: Typography.fontSize.xs,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.primary.main,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    userText: {
        fontSize: Typography.fontSize.base,
        lineHeight: 22,
        color: Colors.neutral.white,
    },
    botText: {
        fontSize: Typography.fontSize.base,
        lineHeight: 22,
        color: Colors.neutral.text.primary,
    },
    timestamp: {
        fontSize: 11,
        color: '#9098B1',
        marginTop: 6,
        marginLeft: 4,
    },
    userTimestamp: {
        textAlign: 'right',
        marginRight: 4,
    },
    productsContainer: {
        marginTop: 12,
    },
    productCard: {
        marginTop: 10,
        borderRadius: 16,
        overflow: 'hidden',
    },
    productGradientBorder: {
        padding: 2,
        borderRadius: 16,
    },
    productContent: {
        flexDirection: 'row',
        backgroundColor: Colors.neutral.white,
        borderRadius: BorderRadius.md,
        padding: Spacing.sm,
        alignItems: 'center',
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 12,
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#223263',
        marginBottom: 6,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    originalPrice: {
        fontSize: 12,
        color: '#9098B1',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    priceGradient: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    productPrice: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.neutral.white,
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    typingBubble: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#667EEA',
    },
    typingText: {
        marginLeft: 12,
        fontSize: 13,
        color: '#9098B1',
        fontStyle: 'italic',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: Spacing.base,
        backgroundColor: Colors.neutral.white,
        borderTopWidth: 1,
        borderTopColor: Colors.neutral.border,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: Colors.neutral.bg,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xs,
        marginRight: Spacing.sm,
    },
    input: {
        fontSize: Typography.fontSize.base,
        maxHeight: 100,
        color: Colors.neutral.text.primary,
        marginBottom: 4,
    },
    charCounter: {
        fontSize: 10,
        color: '#9098B1',
        textAlign: 'right',
    },
    sendButtonWrapper: {
        marginBottom: 4,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
