/**
 * ========================================
 * AUTH SERVICE - Quản lý xác thực người dùng
 * ========================================
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS, STORAGE_KEYS } from "../config/api.config";

// ========================================
// TYPES
// ========================================
export interface UserInfo {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
    avatar?: string;
}

export interface LoginResponse {
    token: string;
    user: UserInfo;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    address?: string; // Optional
}

export interface RegisterResponse {
    token: string;
    tokenType: string;
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Xử lý lỗi từ fetch request
 */
const handleFetchError = (error: any, defaultMessage: string): Error => {
    if (error.message?.includes("CONNECTION_TIMED_OUT") ||
        error.message?.includes("ERR_CONNECTION") ||
        error.message?.includes("Network request failed") ||
        error.message?.includes("Failed to fetch")) {
        return new Error("Không thể kết nối đến server. Vui lòng kiểm tra:\n- Backend server đã chạy chưa?\n- Địa chỉ IP/URL có đúng không?");
    }
    return new Error(error.message || defaultMessage);
};

// ========================================
// AUTH FUNCTIONS
// ========================================

/**
 * Đăng ký tài khoản mới
 */
export const register = async (request: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const response = await fetch(ENDPOINTS.register, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        // Kiểm tra nếu response không phải JSON
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Server trả về lỗi: ${text || response.statusText}`);
        }

        if (!response.ok) {
            // Xử lý lỗi 409 (Conflict) - Email hoặc Phone đã tồn tại
            if (response.status === 409) {
                // Backend trả về message trong field "message"
                const errorMessage = data?.message || "Email hoặc số điện thoại đã được sử dụng. Vui lòng thử lại với thông tin khác.";
                throw new Error(errorMessage);
            }
            // Xử lý các lỗi khác
            const errorMessage = data?.message || data?.error || `Đăng ký thất bại (${response.status})`;
            throw new Error(errorMessage);
        }

        // KHÔNG lưu token sau khi đăng ký - để user tự đăng nhập
        // Chỉ trả về response, không lưu vào storage
        // await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);

        return data;
    } catch (error: any) {
        throw handleFetchError(error, "Đăng ký thất bại");
    }
};

/**
 * Đăng nhập và lưu token + user info
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await fetch(ENDPOINTS.login, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        // Kiểm tra nếu response không phải JSON
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Server trả về lỗi: ${text || response.statusText}`);
        }

        if (!response.ok) {
            throw new Error(data.message || `Đăng nhập thất bại (${response.status})`);
        }

        // Lưu token và user info vào AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));

        return data;
    } catch (error: any) {
        throw handleFetchError(error, "Đăng nhập thất bại");
    }
};

/**
 * Đăng xuất - xóa token và user info
 */
export const logout = async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Lấy token đã lưu
 */
export const getToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Lấy thông tin user đã lưu
 */
export const getStoredUser = async (): Promise<UserInfo | null> => {
    const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (userJson) {
        return JSON.parse(userJson);
    }
    return null;
};

/**
 * Lấy thông tin user từ server (sử dụng token)
 */
export const fetchCurrentUser = async (): Promise<UserInfo> => {
    const token = await getToken();

    if (!token) {
        throw new Error("Chưa đăng nhập");
    }

    try {
        const response = await fetch(ENDPOINTS.me, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        // Kiểm tra nếu response không phải JSON
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Server trả về lỗi: ${text || response.statusText}`);
        }

        if (!response.ok) {
            throw new Error(data.message || `Không thể lấy thông tin người dùng (${response.status})`);
        }

        // Cập nhật user info trong storage
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));

        return data;
    } catch (error: any) {
        throw handleFetchError(error, "Không thể lấy thông tin người dùng");
    }
};

/**
 * Kiểm tra đã đăng nhập chưa
 */
export const isLoggedIn = async (): Promise<boolean> => {
    const token = await getToken();
    return token !== null;
};
/**
 * Gửi mã OTP quên mật khẩu
 */
export const forgotPassword = async (email: string): Promise<any> => {
    try {
        const response = await fetch(ENDPOINTS.forgotPassword, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Không thể gửi mã OTP");
        }
        return data;
    } catch (error: any) {
        throw handleFetchError(error, "Không thể gửi mã OTP");
    }
};

/**
 * Xác thực mã OTP
 */
export const verifyCode = async (email: string, code: string): Promise<any> => {
    try {
        const response = await fetch(ENDPOINTS.verifyCode, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, code }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Mã xác thực không đúng");
        }
        return data;
    } catch (error: any) {
        throw handleFetchError(error, "Xác thực mã thất bại");
    }
};

/**
 * Reset mật khẩu mới
 */
export const resetPassword = async (email: string, code: string, newPassword: string): Promise<any> => {
    try {
        const response = await fetch(ENDPOINTS.resetPassword, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, code, newPassword }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Đổi mật khẩu thất bại");
        }
        return data;
    } catch (error: any) {
        throw handleFetchError(error, "Đổi mật khẩu thất bại");
    }
};

/**
 * Đổi mật khẩu (khi đã đăng nhập)
 */
export const changePassword = async (userId: number, currentPassword: string, newPassword: string): Promise<any> => {
    const token = await getToken();
    if (!token) throw new Error("Chưa đăng nhập");

    try {
        const response = await fetch(`${ENDPOINTS.users}/${userId}/change-password`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Đổi mật khẩu thất bại");
        }
        return data;
    } catch (error: any) {
        throw handleFetchError(error, "Đổi mật khẩu thất bại");
    }
};
