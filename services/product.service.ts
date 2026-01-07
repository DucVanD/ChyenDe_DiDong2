import httpAxios from "./httpAxios";
import { ENDPOINTS } from "../config/api.config";

export interface Product {
    id: number;
    name: string;
    slug: string;
    image: string;
    salePrice: number;
    discountPrice?: number;
    qty: number;
    description?: string;
    detail?: string;
    categoryId: number;
    status: number;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export const getProducts = async (page = 0, size = 12): Promise<PaginatedResponse<Product>> => {
    try {
        const response = await httpAxios.get(ENDPOINTS.products, {
            params: { page, size }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể lấy danh sách sản phẩm");
    }
};

export const getProductById = async (id: number): Promise<Product> => {
    try {
        const response = await httpAxios.get(`${ENDPOINTS.products}/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể lấy thông tin sản phẩm");
    }
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
    try {
        const response = await httpAxios.get(`${ENDPOINTS.products}/slug/${slug}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể lấy thông tin sản phẩm");
    }
};

export const getLatestProducts = async (limit = 6): Promise<Product[]> => {
    try {
        const response = await httpAxios.get(`${ENDPOINTS.products}/latest`, {
            params: { limit }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể lấy sản phẩm mới nhất");
    }
};

export const searchProducts = async (keyword: string, page = 0, size = 12): Promise<PaginatedResponse<Product>> => {
    try {
        const response = await httpAxios.get(`${ENDPOINTS.products}/search`, {
            params: { keyword, page, size }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Lỗi khi tìm kiếm sản phẩm");
    }
};
export const getRelatedProducts = async (id: number, categoryId: number, limit = 4): Promise<Product[]> => {
    try {
        const response = await httpAxios.get(`${ENDPOINTS.products}/${id}/related`, {
            params: { categoryId, limit }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể lấy sản phẩm liên quan");
    }
};

export const filterProducts = async (params: {
    categoryId?: number[];
    status?: number;
    minPrice?: number;
    maxPrice?: number;
    hasPromotion?: boolean;
    sortBy?: string;
    page?: number;
    size?: number;
}): Promise<PaginatedResponse<Product>> => {
    try {
        const response = await httpAxios.get(`${ENDPOINTS.products}/filter`, {
            params
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Lỗi khi lọc sản phẩm");
    }
};

/**
 * Upload image to Cloudinary (via backend)
 */
export const uploadImage = async (imageUri: string): Promise<string> => {
    try {
        // Create FormData
        const formData = new FormData();
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('file', {
            uri: imageUri,
            name: filename,
            type
        } as any);

        // Upload to backend
        const response = await httpAxios.post(`${ENDPOINTS.products}/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.url || response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể tải ảnh lên");
    }
};
