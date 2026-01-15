import httpAxios from "./httpAxios";
import { ENDPOINTS } from "../config/api.config";

export interface VNPayPaymentResponse {
    status: string;
    paymentUrl: string;
    message: string;
}

export interface VNPayCallbackResponse {
    status: string;
    message: string;
    orderId?: string;
}

/**
 * Tạo URL thanh toán VNPay
 */
export const createVNPayPayment = async (orderId: number): Promise<VNPayPaymentResponse> => {
    try {
        const response = await httpAxios.post(`${ENDPOINTS.payments}/vnpay/create`, null, {
            params: { orderId }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Lỗi tạo thanh toán VNPay");
    }
};

/**
 * Xử lý callback từ VNPay (nếu cần)
 */
export const handleVNPayCallback = async (params: Record<string, string>): Promise<VNPayCallbackResponse> => {
    try {
        const response = await httpAxios.get(`${ENDPOINTS.payments}/vnpay/callback`, { params });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Lỗi xử lý callback VNPay");
    }
};
