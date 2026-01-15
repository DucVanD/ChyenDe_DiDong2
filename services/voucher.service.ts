import httpAxios from "./httpAxios";
import { ENDPOINTS } from "../config/api.config";

export interface Voucher {
    id: number;
    voucherCode: string;
    name: string;
    description: string;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount?: number;
    startDate: string;
    endDate: string;
    usageLimit: number;
    usedCount: number;
    status: number; // 1: Active, 0: Inactive
}

export interface VoucherCheckResponse {
    isValid: boolean;
    valid?: boolean; // Support both naming conventions from backend
    discountAmount: number;
    discountType?: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue?: number;
    maxDiscountAmount?: number;
    minOrderAmount?: number;
    voucherCode?: string;
    message?: string;
}

export const getActiveVouchers = async (): Promise<Voucher[]> => {
    try {
        const response = await httpAxios.get(`${ENDPOINTS.vouchers}/active`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Lỗi khi tải danh sách voucher");
    }
};

export const checkVoucher = async (code: string, orderAmount: number): Promise<VoucherCheckResponse> => {
    try {
        const response = await httpAxios.get(`${ENDPOINTS.vouchers}/check`, {
            params: { code, orderAmount }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Lỗi khi kiểm tra mã giảm giá");
    }
};
