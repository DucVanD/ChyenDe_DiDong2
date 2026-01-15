import httpAxios from './httpAxios';

export interface ChatMessage {
    id: string;
    message: string;
    isUser: boolean;
    timestamp: Date;
    products?: any[]; // Product suggestions from AI
}

export interface ChatHistoryItem {
    role: 'user' | 'model';
    content: string;
}

export interface ChatRequest {
    message: string;
    userId?: number;
    history?: ChatHistoryItem[];
}

export interface ChatResponse {
    message: string;
    products?: any[];
    type: 'text' | 'products';
}

/**
 * Send message to AI chatbot
 */
export const sendChatMessage = async (
    message: string,
    userId?: number,
    history?: ChatHistoryItem[]
): Promise<ChatResponse> => {
    const response = await httpAxios.post<ChatResponse>('/chat', {
        message,
        userId,
        history
    });
    return response.data;
};
