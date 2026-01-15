import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import httpAxios from '../services/httpAxios';
import { getStoredUser, UserInfo } from '../services/auth.service';
import { updateUserProfile } from '../services/user.service';
import { API_BASE_URL, STORAGE_KEYS } from '../config/api.config';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from "@/constants/theme";
import { showToast } from './components/common/Toast';
import * as Haptics from 'expo-haptics';

export default function EditProfile() {
    const router = useRouter();

    const [user, setUser] = useState<UserInfo | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Load user data
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await getStoredUser();
                if (storedUser) {
                    setUser(storedUser);
                    setName(storedUser.name || '');
                    setEmail(storedUser.email || '');
                    setPhone(storedUser.phone || '');
                    setAddress(storedUser.address || '');
                    setAvatar(storedUser.avatar || '');
                } else {
                    router.replace('/login');
                }
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    // Pick image from gallery
    const pickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                showToast({ message: 'Cần cấp quyền truy cập thư viện ảnh', type: 'error' });
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images' as any,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const imageUri = result.assets[0].uri;

                // Validate file size (max 5MB)
                if (result.assets[0].fileSize && result.assets[0].fileSize > 5 * 1024 * 1024) {
                    showToast({ message: 'Kích thước ảnh không được vượt quá 5MB', type: 'warning' });
                    return;
                }

                setAvatar(imageUri);
                await uploadAvatar(imageUri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            showToast({ message: 'Không thể chọn ảnh', type: 'error' });
        }
    };

    // Upload avatar to server
    const uploadAvatar = async (imageUri: string) => {
        if (!user) return;

        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            const filename = imageUri.split('/').pop() || 'avatar.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            // Web platform: handle both blob: and data: URIs
            if (Platform.OS === 'web') {
                const response = await fetch(imageUri);
                const blob = await response.blob();
                const file = new File([blob], filename, { type: blob.type || type });
                formData.append('file', file);
            } else {
                // Mobile platform: use uri directly
                formData.append('file', {
                    uri: imageUri,
                    name: filename,
                    type,
                } as any);
            }

            const config = Platform.OS === 'web'
                ? {}
                : { headers: { 'Content-Type': 'multipart/form-data' } };

            const response = await httpAxios.post('/upload/user', formData, config);

            if (response.data && response.data.url) {
                setAvatar(response.data.url);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                showToast({ message: 'Cập nhật ảnh đại diện thành công', type: 'success' });
            }
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            showToast({ message: 'Không thể tải ảnh lên. Vui lòng thử lại', type: 'error' });
        } finally {
            setUploadingAvatar(false);
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        if (!name.trim()) {
            showToast({ message: 'Vui lòng nhập họ tên', type: 'warning' });
            return false;
        }
        const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
        if (!nameRegex.test(name.trim())) {
            showToast({ message: 'Họ tên chỉ được chứa chữ cái và khoảng trắng', type: 'warning' });
            return false;
        }
        if (!phone.trim()) {
            showToast({ message: 'Vui lòng nhập số điện thoại', type: 'warning' });
            return false;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone.trim())) {
            showToast({ message: 'Số điện thoại không hợp lệ (10 số)', type: 'warning' });
            return false;
        }
        return true;
    };

    // Handle save
    const handleSave = async () => {
        if (!validateForm()) return;
        if (!user) return;

        setSaving(true);
        try {
            await updateUserProfile(user.id, {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                address: address.trim(),
                avatar: avatar,
            });

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            showToast({ message: 'Cập nhật hồ sơ thành công!', type: 'success' });
            setTimeout(() => router.back(), 1500);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            showToast({ message: error.message || 'Không thể cập nhật hồ sơ', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.neutral.text.secondary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    style={styles.saveButton}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color={Colors.primary.main} />
                    ) : (
                        <Text style={styles.saveButtonText}>Lưu</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={
                                avatar
                                    ? { uri: avatar }
                                    : require('../assets/images/avatar.jpg')
                            }
                            style={styles.avatar}
                        />
                        <TouchableOpacity
                            style={styles.cameraButton}
                            onPress={pickImage}
                            disabled={uploadingAvatar}
                        >
                            {uploadingAvatar ? (
                                <ActivityIndicator size="small" color={Colors.neutral.white} />
                            ) : (
                                <Ionicons name="camera" size={20} color={Colors.neutral.white} />
                            )}
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.avatarHint}>Nhấn vào camera để thay đổi ảnh</Text>
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    {/* Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Họ tên *</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Nhập họ tên"
                                placeholderTextColor={Colors.neutral.text.tertiary}
                            />
                        </View>
                    </View>

                    {/* Email (Read-only) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={[styles.inputWrapper, styles.inputDisabledWrapper]}>
                            <Ionicons name="mail-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.inputDisabled]}
                                value={email}
                                editable={false}
                                placeholder="Email"
                                placeholderTextColor={Colors.neutral.text.tertiary}
                            />
                        </View>
                        <Text style={styles.helperText}>Email không thể thay đổi</Text>
                    </View>

                    {/* Phone */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Số điện thoại *</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="call-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Nhập số điện thoại"
                                placeholderTextColor={Colors.neutral.text.tertiary}
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </View>
                    </View>

                    {/* Address */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Địa chỉ</Text>
                        <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                            <Ionicons name="location-outline" size={20} color={Colors.neutral.text.tertiary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Nhập địa chỉ"
                                placeholderTextColor={Colors.neutral.text.tertiary}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.neutral.white,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral.border,
        backgroundColor: Colors.neutral.white,
    },
    headerTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.neutral.text.primary,
    },
    backButton: {
        padding: 4,
    },
    saveButton: {
        paddingVertical: 4,
        paddingHorizontal: Spacing.sm,
    },
    saveButtonText: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.primary.main,
    },
    contentContainer: {
        padding: Spacing.base,
    },

    // Avatar Section
    avatarSection: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        marginTop: Spacing.md,
    },
    avatarContainer: {
        position: 'relative',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary.main,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.neutral.white,
        ...Shadows.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: Colors.neutral.bg,
    },
    avatarHint: {
        marginTop: 12,
        fontSize: Typography.fontSize.xs,
        color: Colors.neutral.text.tertiary,
        fontStyle: 'italic',
    },

    // Form
    formContainer: {
        gap: Spacing.lg,
    },
    inputGroup: {
        marginBottom: 4,
    },
    label: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.neutral.text.primary,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.neutral.border,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        backgroundColor: Colors.neutral.bg,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: Typography.fontSize.base,
        color: Colors.neutral.text.primary,
    },
    inputDisabledWrapper: {
        backgroundColor: '#F3F4F6',
        borderColor: 'transparent',
    },
    inputDisabled: {
        color: Colors.neutral.text.tertiary,
    },
    textAreaWrapper: {
        alignItems: 'flex-start',
        paddingTop: 12,
    },
    textArea: {
        minHeight: 100,
        paddingTop: 0,
    },
    helperText: {
        fontSize: Typography.fontSize.xs,
        color: Colors.neutral.text.tertiary,
        marginTop: 4,
        fontStyle: 'italic',
    },
});
