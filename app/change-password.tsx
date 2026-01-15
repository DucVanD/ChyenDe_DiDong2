import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { changePassword, getStoredUser } from "../services/auth.service";
import { Colors, Spacing, BorderRadius, Typography, Shadows } from "@/constants/theme";
import { showToast } from "./components/common/Toast";
import { Button } from "./components/common/Button";
import * as Haptics from 'expo-haptics';

export default function ChangePassword() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            const user = await getStoredUser();
            if (user) {
                setUserId(user.id);
            } else {
                showToast({ message: "Bạn cần đăng nhập để thực hiện tính năng này", type: "warning" });
                router.replace("/(auth)/login");
            }
        };
        loadUser();
    }, []);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast({ message: "Vui lòng nhập đầy đủ thông tin", type: "warning" });
            return;
        }
        if (newPassword.length < 8) {
            showToast({ message: "Mật khẩu mới phải có ít nhất 8 ký tự", type: "warning" });
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            showToast({ message: "Mật khẩu phải chứa chữ hoa, thường, số và ký tự đặc biệt", type: "error" });
            return;
        }
        if (newPassword === currentPassword) {
            showToast({ message: "Mật khẩu mới phải khác mật khẩu hiện tại", type: "warning" });
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast({ message: "Mật khẩu mới xác nhận không khớp", type: "error" });
            return;
        }
        if (!userId) return;

        setLoading(true);
        try {
            await changePassword(userId, currentPassword, newPassword);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            showToast({ message: "Đổi mật khẩu thành công", type: "success" });
            router.back();
        } catch (error: any) {
            showToast({ message: error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.neutral.text.primary} />
                </TouchableOpacity>

                <Text style={styles.title}>Đổi mật khẩu</Text>
                <Text style={styles.instruction}>Cập nhật mật khẩu mới để bảo mật tài khoản của bạn</Text>

                <View style={[styles.inputContainer, { marginTop: Spacing.xl }]}>
                    <View style={styles.inputWrap}>
                        <Ionicons name="lock-closed-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
                        <TextInput
                            placeholder="Mật khẩu hiện tại"
                            placeholderTextColor={Colors.neutral.text.tertiary}
                            style={styles.input}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputWrap}>
                        <Ionicons name="lock-closed-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
                        <TextInput
                            placeholder="Mật khẩu mới"
                            placeholderTextColor={Colors.neutral.text.tertiary}
                            style={styles.input}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputWrap}>
                        <Ionicons name="lock-closed-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
                        <TextInput
                            placeholder="Xác nhận mật khẩu mới"
                            placeholderTextColor={Colors.neutral.text.tertiary}
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>
                </View>

                <View style={{ marginTop: Spacing.xl }}>
                    <Button
                        title="Cập nhật mật khẩu"
                        onPress={handleChangePassword}
                        loading={loading}
                        disabled={loading}
                        fullWidth
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.neutral.white,
    },
    scrollContent: {
        padding: Spacing.xl,
        paddingTop: Platform.OS === 'ios' ? 60 : Spacing["2xl"],
    },
    backButton: {
        marginBottom: Spacing.xl,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    title: {
        fontSize: Typography.fontSize["3xl"],
        fontWeight: Typography.fontWeight.bold,
        color: Colors.neutral.text.primary,
        marginBottom: Spacing.xs,
    },
    instruction: {
        fontSize: Typography.fontSize.base,
        color: Colors.neutral.text.secondary,
        marginBottom: Spacing.lg,
        lineHeight: 24,
    },
    inputContainer: {
        gap: Spacing.base,
    },
    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.neutral.bg,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.base,
        height: 56,
        borderWidth: 1,
        borderColor: Colors.neutral.border,
    },
    inputIcon: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: Typography.fontSize.base,
        color: Colors.neutral.text.primary,
        height: '100%',
    },
});
