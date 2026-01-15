/**
 * ========================================
 * CẤU HÌNH API CHO ỨNG DỤNG
 * ========================================
 * Thay đổi BASE_URL khi deploy lên server thực
 */

import { Platform } from "react-native";

// Tự động chọn URL phù hợp với platform
// Web: dùng localhost
// Mobile: dùng IP máy chạy backend (thay đổi IP này nếu cần)
const IP_ADDRESS = "10.0.0.177"; // IP backend ADMIN_DiDong/demo
const PORT = "8080";

export const API_BASE_URL =
    Platform.OS === "web"
        ? `http://localhost:${PORT}/api`      // 🌐 WEB
        : `http://${IP_ADDRESS}:${PORT}/api`; // 📱 MOBILE

// ========================================
// ENDPOINTS
// ========================================
export const ENDPOINTS = {
    // Auth
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    me: `${API_BASE_URL}/auth/me`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    verifyCode: `${API_BASE_URL}/auth/verify-code`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,

    // Products
    products: `${API_BASE_URL}/products`,
    flashSale: `${API_BASE_URL}/products/flash-sale`,
    megaSale: `${API_BASE_URL}/products/mega-sale`,
    bestSelling: `${API_BASE_URL}/products/best-selling`,

    // Categories
    categories: `${API_BASE_URL}/categories`,

    // Cart
    cart: `${API_BASE_URL}/cart`,

    // Orders
    orders: `${API_BASE_URL}/orders`,

    // Vouchers
    vouchers: `${API_BASE_URL}/vouchers`,

    // Payments
    payments: `${API_BASE_URL}/payments`,

    // Users
    users: `${API_BASE_URL}/users`,
};

// ========================================
// ASYNC STORAGE KEYS
// ========================================
export const STORAGE_KEYS = {
    TOKEN: "auth_token",
    USER: "user_info",
    SAVED_EMAIL: "saved_email",        // For "Remember Me" feature
    REMEMBER_ME: "remember_me",        // Boolean flag
};
