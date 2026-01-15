import AsyncStorage from '@react-native-async-storage/async-storage';
import httpAxios from './httpAxios';
import { STORAGE_KEYS } from '../config/api.config';

const CART_STORAGE_KEY = '@cart_items';

export interface CartItem {
    id: number; // For local: product id. For backend: cart item id.
    productId: number;
    name: string;
    salePrice: number;
    discountPrice?: number;
    image: string;
    quantity: number;
    selectedSize?: string;
    stock: number;
}

// Simple event listener logic for real-time updates
type CartChangeListener = (count: number) => void;
const listeners: Set<CartChangeListener> = new Set();

export const subscribeToCartChanges = (listener: CartChangeListener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

const notifyListeners = async () => {
    const cart = await getLocalCart(); // Use local data to avoid network loop
    const count = cart.length;
    listeners.forEach(listener => listener(count));
};

/**
 * Get the JWT token from AsyncStorage
 */
const getToken = async () => await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

/**
 * Get cart items from AsyncStorage (fallback/cache)
 */
const getLocalCart = async (): Promise<CartItem[]> => {
    try {
        const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (cartJson) {
            return JSON.parse(cartJson);
        }
        return [];
    } catch (error) {
        console.error('Error getting local cart:', error);
        return [];
    }
};

/**
 * Save cart items to AsyncStorage
 */
const saveLocalCart = async (cart: CartItem[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving local cart:', error);
    }
};

/**
 * Map backend cart item to mobile CartItem interface
 */
const mapBackendItem = (item: any): CartItem => ({
    id: item.id, // backend cart item id
    productId: item.productId,
    name: item.product.name,
    salePrice: item.product.salePrice,
    discountPrice: item.product.discountPrice,
    image: item.product.image,
    quantity: item.quantity,
    stock: item.product.stock,
});

/**
 * Get cart items - Syncs with backend if logged in
 */
export const getCart = async (): Promise<CartItem[]> => {
    const token = await getToken();
    if (!token) return await getLocalCart();

    try {
        const response = await httpAxios.get('/cart');
        const backendItems = response.data.items.map(mapBackendItem);
        await saveLocalCart(backendItems);
        return backendItems;
    } catch (error) {
        console.error('Error fetching cart from backend:', error);
        return await getLocalCart();
    }
};

/**
 * Sync local cart with backend after login
 */
export const syncCartAfterLogin = async (): Promise<void> => {
    const token = await getToken();
    if (!token) return;

    try {
        const localCart = await getLocalCart();
        if (localCart.length === 0) return;

        // Add each local item to backend cart
        for (const item of localCart) {
            await httpAxios.post('/cart/items', null, {
                params: {
                    productId: item.productId,
                    quantity: item.quantity
                }
            });
        }

        // Clear local cart after sync
        await AsyncStorage.removeItem(CART_STORAGE_KEY);
        await getCart(); // Refresh from backend
        notifyListeners(); // Notify after sync complete
    } catch (error) {
        console.error('Error syncing cart after login:', error);
    }
};

/**
 * Add product to cart
 */
export const addToCart = async (
    product: {
        id: number;
        name: string;
        salePrice: number;
        discountPrice?: number;
        image: string;
        stock: number;
    },
    quantity: number = 1,
    selectedSize?: string
): Promise<{ success: boolean; message: string }> => {
    try {
        // Stock validation
        if (quantity > product.stock) {
            return { success: false, message: `Chỉ còn ${product.stock} sản phẩm` };
        }

        const token = await getToken();
        if (token) {
            try {
                await httpAxios.post('/cart/items', null, {
                    params: { productId: product.id, quantity }
                });
                await getCart(); // Update cache
                notifyListeners();
                return { success: true, message: 'Đã thêm vào giỏ hàng' };
            } catch (error) {
                console.error('Backend add to cart failed:', error);
            }
        }

        // Fallback or guest user: handle locally
        const cart = await getLocalCart();
        const existingIndex = cart.findIndex(i => i.productId === product.id && i.selectedSize === selectedSize);

        if (existingIndex >= 0) {
            const newQty = cart[existingIndex].quantity + quantity;
            if (newQty > product.stock) return { success: false, message: 'Vượt quá số lượng trong kho' };
            cart[existingIndex].quantity = newQty;
        } else {
            cart.push({
                id: product.id,
                productId: product.id,
                name: product.name,
                salePrice: product.salePrice,
                discountPrice: product.discountPrice,
                image: product.image,
                quantity,
                selectedSize,
                stock: product.stock
            });
        }
        await saveLocalCart(cart);
        notifyListeners();
        return { success: true, message: 'Đã thêm vào giỏ hàng' };
    } catch (error) {
        return { success: false, message: 'Có lỗi xảy ra' };
    }
};

/**
 * Update quantity
 */
export const updateQuantity = async (
    itemId: number, // can be productId (local) or cartItemId (backend)
    quantity: number,
    selectedSize?: string // kept for local lookup compatibility
): Promise<{ success: boolean; message: string }> => {
    try {
        const token = await getToken();
        if (token) {
            try {
                await httpAxios.put(`/cart/items/${itemId}`, null, {
                    params: { quantity }
                });
                await getCart();
                notifyListeners();
                return { success: true, message: 'Đã cập nhật' };
            } catch (error) {
                console.error('Backend update failed:', error);
            }
        }

        const cart = await getLocalCart();
        const index = cart.findIndex(i => i.id === itemId && i.selectedSize === selectedSize);
        if (index >= 0) {
            if (quantity > cart[index].stock) return { success: false, message: 'Hết hàng' };
            cart[index].quantity = quantity;
            await saveLocalCart(cart);
            notifyListeners();
            return { success: true, message: 'Đã cập nhật' };
        }
        return { success: false, message: 'Không tìm thấy' };
    } catch (error) {
        return { success: false, message: 'Có lỗi xảy ra' };
    }
};

/**
 * Remove item
 */
export const removeFromCart = async (
    itemId: number,
    selectedSize?: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const token = await getToken();
        if (token) {
            try {
                await httpAxios.delete(`/cart/items/${itemId}`);
                await getCart();
                notifyListeners();
                return { success: true, message: 'Đã xóa' };
            } catch (error) {
                console.error('Backend remove failed:', error);
            }
        }

        const cart = await getLocalCart();
        const updated = cart.filter(i => !(i.id === itemId && i.selectedSize === selectedSize));
        await saveLocalCart(updated);
        notifyListeners();
        return { success: true, message: 'Đã xóa' };
    } catch (error) {
        return { success: false, message: 'Có lỗi xảy ra' };
    }
};

/**
 * Clear cart
 */
export const clearCart = async (): Promise<void> => {
    const token = await getToken();
    if (token) {
        try {
            await httpAxios.delete('/cart');
        } catch (error) {
            console.error('Backend clear failed:', error);
        }
    }
    await AsyncStorage.removeItem(CART_STORAGE_KEY);
    notifyListeners();
};

/**
 * Remove only purchased items (for partial cart clearing)
 */
export const removePurchasedItems = async (itemKeys: string[]): Promise<void> => {
    if (!itemKeys || itemKeys.length === 0) return;

    try {
        const cart = await getCart();
        const token = await getToken();

        // 1. Identify items to remove matching the keys (id-size)
        const itemsToRemove = cart.filter(item =>
            itemKeys.includes(`${item.id}-${item.selectedSize || 'default'}`)
        );

        if (token) {
            // Remove from backend one by one
            for (const item of itemsToRemove) {
                try {
                    await httpAxios.delete(`/cart/items/${item.id}`);
                } catch (e) {
                    console.error(`Failed to remove item ${item.id} from backend:`, e);
                }
            }
            // Refresh local cache from backend
            await getCart();
        } else {
            // Remove from local storage
            const updated = cart.filter(item =>
                !itemKeys.includes(`${item.id}-${item.selectedSize || 'default'}`)
            );
            await saveLocalCart(updated);
        }
    } catch (error) {
        console.error('Error removing purchased items:', error);
    }
};

export const getCartCount = async (): Promise<number> => {
    const cart = await getLocalCart(); // Use local cache for counts to prevent infinite loop
    return cart.length;
};

export const getCartTotal = async (): Promise<number> => {
    const cart = await getLocalCart(); // Use local cache
    return cart.reduce((sum, item) => sum + (item.discountPrice || item.salePrice || 0) * item.quantity, 0);
};

