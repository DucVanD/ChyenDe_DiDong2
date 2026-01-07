import httpAxios from "./httpAxios";
import { ENDPOINTS, STORAGE_KEYS } from "../config/api.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UpdateUserDto {
    name: string;
    email: string;
    phone: string;
    address?: string;
    avatar?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address?: string;
    avatar?: string;
    role: string;
    status: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: number, data: UpdateUserDto): Promise<User> => {
    try {
        const response = await httpAxios.put(`${ENDPOINTS.users}/${userId}`, data);

        // Update stored user info in AsyncStorage
        const updatedUser = response.data;
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

        return updatedUser;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể cập nhật hồ sơ");
    }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: number): Promise<User> => {
    try {
        const response = await httpAxios.get(`${ENDPOINTS.users}/${userId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể lấy thông tin người dùng");
    }
};
