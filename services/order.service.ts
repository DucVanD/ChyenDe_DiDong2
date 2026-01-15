import httpAxios from "./httpAxios";
import { ENDPOINTS } from "../config/api.config";

export interface OrderItem {
    id?: number;
    productId: number;
    productName?: string;
    productImage?: string;
    quantity: number; // Backend uses 'quantity' not 'qty'
    priceBuy: number; // Backend uses 'priceBuy' not 'price'
    amount?: number;   // Backend uses 'amount' not 'total'
}

export interface Order {
    id?: number;
    orderCode?: string;
    userId: number;
    receiverName: string;
    receiverPhone: string;
    receiverEmail?: string;
    receiverAddress: string;
    ward?: string;
    district?: string;
    note?: string;
    voucherId?: number;
    voucherCode?: string;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    totalAmount: number;
    paymentMethod: string; // "COD", "BANK_TRANSFER", etc.
    paymentStatus?: string; // "UNPAID", "PAID", etc.
    status?: string | number; // Backend returns string: "PENDING", "CONFIRMED", etc.
    cancelReason?: string;
    orderDetails: OrderItem[]; // Backend uses 'orderDetails' not 'items'
    createdAt?: string;
    updatedAt?: string;
    completedAt?: string;
}

// Helper function to convert string status to number for display
export const getStatusNumber = (status: string | number): number => {
    if (typeof status === 'number') return status;

    const statusMap: { [key: string]: number } = {
        'PENDING': 0,
        'CONFIRMED': 1,
        'PREPARING': 2,
        'SHIPPING': 3,
        'COMPLETED': 4,
        'CANCELLED': 5
    };

    return statusMap[status] ?? 0;
};

export const getMyOrders = async (page = 1, filters = {}): Promise<any> => {
    try {
        const response = await httpAxios.get(`${ENDPOINTS.orders}/my-orders`, {
            params: { page, ...filters }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể lấy danh sách đơn hàng");
    }
};

export const getOrderById = async (id: number): Promise<Order> => {
    try {
        const response = await httpAxios.get(`${ENDPOINTS.orders}/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể lấy thông tin đơn hàng");
    }
};

export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    try {
        const response = await httpAxios.post(ENDPOINTS.orders, orderData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể tạo đơn hàng");
    }
};

export const cancelOrder = async (id: number, reason: string): Promise<any> => {
    try {
        const response = await httpAxios.put(`${ENDPOINTS.orders}/${id}/cancel`, null, {
            params: { reason }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Không thể hủy đơn hàng");
    }
};
