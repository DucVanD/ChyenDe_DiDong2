/**
 * ToastProvider - Global Toast Management
 * Wrap your app with this provider to use toast notifications globally
 */

import React, { useState, useCallback } from 'react';
import { Toast, setToastCallback } from './Toast';

interface ToastState {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration: number;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<ToastState>({
        visible: false,
        message: '',
        type: 'success',
        duration: 2000,
    });

    const showToast = useCallback(
        ({
            message,
            type = 'success',
            duration = 2000,
        }: {
            message: string;
            type?: 'success' | 'error' | 'info' | 'warning';
            duration?: number;
        }) => {
            setToast({ visible: true, message, type, duration });
        },
        []
    );

    const hideToast = useCallback(() => {
        setToast((prev) => ({ ...prev, visible: false }));
    }, []);

    // Register global toast callback
    React.useEffect(() => {
        setToastCallback(showToast);
    }, [showToast]);

    return (
        <>
            {children}
            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onHide={hideToast}
                />
            )}
        </>
    );
};
