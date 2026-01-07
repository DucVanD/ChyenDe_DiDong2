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
    Alert,
} from 'react-native';
import { getStoredUser, UserInfo } from '../services/auth.service';
import { updateUserProfile } from '../services/user.service';

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

    // Validate form
    const validateForm = (): boolean => {
        if (!name.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
            return false;
        }
        if (!phone.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
            return false;
        }
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(phone.trim())) {
            Alert.alert('Lỗi', 'Số điện thoại không hợp lệ (10-11 số)');
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
            // Update profile
            await updateUserProfile(user.id, {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                address: address.trim(),
                avatar: avatar, // Keep existing avatar
            });

            Alert.alert('Thành công', 'Cập nhật hồ sơ thành công!', [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            Alert.alert('Lỗi', error.message || 'Không thể cập nhật hồ sơ');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#40BFFF" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#9098B1" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    style={styles.saveButton}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color="#40BFFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>Lưu</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Avatar Section - Display only, no change */}
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
                    </View>
                    <Text style={styles.avatarHint}>Upload ảnh sẽ có trong phiên bản sau</Text>
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    {/* Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Họ tên *</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color="#9098B1" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Nhập họ tên"
                                placeholderTextColor="#9098B1"
                            />
                        </View>
                    </View>

                    {/* Email (Read-only) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={[styles.inputWrapper, styles.inputDisabled]}>
                            <Ionicons name="mail-outline" size={20} color="#9098B1" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.inputDisabled]}
                                value={email}
                                editable={false}
                                placeholder="Email"
                                placeholderTextColor="#9098B1"
                            />
                        </View>
                        <Text style={styles.helperText}>Email không thể thay đổi</Text>
                    </View>

                    {/* Phone */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Số điện thoại *</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="call-outline" size={20} color="#9098B1" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Nhập số điện thoại"
                                placeholderTextColor="#9098B1"
                                keyboardType="phone-pad"
                                maxLength={11}
                            />
                        </View>
                    </View>

                    {/* Address */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Địa chỉ</Text>
                        <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                            <Ionicons name="location-outline" size={20} color="#9098B1" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Nhập địa chỉ"
                                placeholderTextColor="#9098B1"
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
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EBF0FF',
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#223263',
    },
    backButton: {
        padding: 4,
    },
    saveButton: {
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    saveButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#40BFFF',
    },
    contentContainer: {
        padding: 16,
    },

    // Avatar Section
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 16,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#40BFFF',
    },
    avatarHint: {
        marginTop: 12,
        fontSize: 12,
        color: '#9098B1',
        fontStyle: 'italic',
    },

    // Form
    formContainer: {
        gap: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#223263',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EBF0FF',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FAFAFA',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: '#223263',
    },
    inputDisabled: {
        backgroundColor: '#F5F5F5',
        color: '#9098B1',
    },
    textAreaWrapper: {
        alignItems: 'flex-start',
        paddingTop: 12,
    },
    textArea: {
        minHeight: 80,
        paddingTop: 0,
    },
    helperText: {
        fontSize: 11,
        color: '#9098B1',
        marginTop: 4,
        fontStyle: 'italic',
    },
});
