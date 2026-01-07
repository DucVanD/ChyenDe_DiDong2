import httpAxios from "./httpAxios";
import { ENDPOINTS } from "../config/api.config";

export interface VoucherCheckResponse {
    isValid: boolean;
    discountAmount: number;
    message?: string;
}

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
