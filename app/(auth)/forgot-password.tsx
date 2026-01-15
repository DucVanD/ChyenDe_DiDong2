import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
    SafeAreaView,
    StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { forgotPassword, verifyCode, resetPassword } from "../../services/auth.service";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/theme";

type Step = "EMAIL" | "OTP" | "RESET";

export default function ForgotPassword() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("EMAIL");
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSendOtp = async () => {
        if (!email.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập email của bạn");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
        if (!emailRegex.test(email)) {
            Alert.alert("Lỗi", "Vui lòng nhập địa chỉ email hợp lệ!");
            return;
        }
        setLoading(true);
        try {
            await forgotPassword(email);
            Alert.alert("Thành công", "Mã OTP đã được gửi đến email của bạn");
            setStep("OTP");
        } catch (error: any) {
            Alert.alert("Lỗi", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập mã OTP");
            return;
        }
        if (otp.length !== 6 || !/^[0-9]{6}$/.test(otp)) {
            Alert.alert("Lỗi", "Mã OTP phải gồm 6 chữ số");
            return;
        }
        setLoading(true);
        try {
            await verifyCode(email, otp);
            setStep("RESET");
        } catch (error: any) {
            Alert.alert("Lỗi", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
            return;
        }
        if (newPassword.length < 8) {
            Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 8 ký tự");
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            Alert.alert("Lỗi", "Mật khẩu phải chứa: Chữ hoa, chữ thường, số và ký tự đặc biệt!");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
            return;
        }
        setLoading(true);
        try {
            await resetPassword(email, otp, newPassword);
            Alert.alert("Thành công", "Đổi mật khẩu thành công. Vui lòng đăng nhập lại", [
                { text: "Đăng nhập ngay", onPress: () => router.replace("/login") }
            ]);
        } catch (error: any) {
            Alert.alert("Lỗi", error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderGradientButton = (onPress: () => void, text: string) => (
        <TouchableOpacity onPress={onPress} disabled={loading} activeOpacity={0.8} style={{ marginTop: 10 }}>
            <LinearGradient
                colors={[Colors.primary.main, Colors.primary.dark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
            >
                {loading ? <ActivityIndicator color={Colors.neutral.white} /> : <Text style={styles.buttonText}>{text}</Text>}
            </LinearGradient>
        </TouchableOpacity>
    );

    const renderEmailStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.instruction}>Nhập email của bạn để nhận mã xác thực (OTP)</Text>
            <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
                <TextInput
                    placeholder="Email của bạn"
                    style={styles.input}
                    placeholderTextColor={Colors.neutral.text.tertiary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            {renderGradientButton(handleSendOtp, "Gửi mã OTP")}
        </View>
    );

    const renderOtpStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.instruction}>Nhập mã OTP gồm 6 chữ số đã được gửi đến <Text style={styles.highlight}>{email}</Text></Text>
            <View style={styles.inputWrap}>
                <Ionicons name="key-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
                <TextInput
                    placeholder="Mã OTP"
                    style={styles.input}
                    placeholderTextColor={Colors.neutral.text.tertiary}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                />
            </View>
            {renderGradientButton(handleVerifyOtp, "Xác nhận mã")}
            <TouchableOpacity onPress={handleSendOtp} style={{ marginTop: 24 }}>
                <Text style={styles.resendText}>Chưa nhận được mã? <Text style={styles.resendLink}>Gửi lại ngay</Text></Text>
            </TouchableOpacity>
        </View>
    );

    const renderResetStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.instruction}>Nhập mật khẩu mới cho tài khoản của bạn</Text>
            <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
                <TextInput
                    placeholder="Mật khẩu mới"
                    style={styles.input}
                    placeholderTextColor={Colors.neutral.text.tertiary}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />
            </View>
            <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
                <TextInput
                    placeholder="Xác nhận mật khẩu mới"
                    style={styles.input}
                    placeholderTextColor={Colors.neutral.text.tertiary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>
            {renderGradientButton(handleResetPassword, "Đổi mật khẩu")}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.neutral.text.primary} />
                    </TouchableOpacity>

                    <Text style={styles.title}>Quên mật khẩu</Text>
                    <View style={styles.divider} />

                    {step === "EMAIL" && renderEmailStep()}
                    {step === "OTP" && renderOtpStep()}
                    {step === "RESET" && renderResetStep()}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.neutral.white,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: 20 },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.neutral.text.primary,
    },
    divider: {
        width: 40,
        height: 4,
        backgroundColor: Colors.primary.main,
        borderRadius: BorderRadius.full,
        marginTop: 8,
        marginBottom: 32,
    },
    stepContainer: {
        flex: 1,
    },
    instruction: {
        fontSize: Typography.fontSize.base,
        color: Colors.neutral.text.secondary,
        lineHeight: 24,
        marginBottom: 32,
    },
    highlight: {
        fontWeight: Typography.fontWeight.bold,
        color: Colors.neutral.text.primary,
    },
    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.neutral.bg,
        borderRadius: BorderRadius.md,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: Colors.neutral.border,
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: Typography.fontSize.base, color: Colors.neutral.text.primary },
    button: {
        height: 56,
        borderRadius: BorderRadius.md,
        justifyContent: "center",
        alignItems: "center",
        ...Shadows.md,
    },
    buttonText: { color: Colors.neutral.white, fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.bold },
    resendText: {
        color: Colors.neutral.text.secondary,
        textAlign: "center",
        fontSize: Typography.fontSize.sm,
    },
    resendLink: {
        color: Colors.primary.main,
        fontWeight: Typography.fontWeight.bold,
    },
});
