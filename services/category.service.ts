import httpAxios from "./httpAxios";
import { ENDPOINTS } from "../config/api.config";

export interface Category {
    id: number;
    name: string;
    slug: string;
    image?: string;
    description?: string;
    parentId?: number;
    status: number;
}

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await httpAxios.get(ENDPOINTS.categories);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể lấy danh sách danh mục");
    }
};
export const getCategoryById = async (id: number): Promise<Category> => {
    try {
        const response = await httpAxios.get(`${ENDPOINTS.categories}/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể lấy thông tin danh mục");
    }
};
