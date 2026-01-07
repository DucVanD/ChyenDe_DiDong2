import { Alert, Platform } from 'react-native';

/**
 * Cross-platform alert that works on both mobile and web
 */
export const showAlert = (
    title: string,
    message?: string,
    buttons?: Array<{
        text: string;
        onPress?: () => void;
        style?: 'default' | 'cancel' | 'destructive';
    }>
) => {
    if (Platform.OS === 'web') {
        // For web, use window.confirm/alert
        const fullMessage = message ? `${title}\n\n${message}` : title;

        if (buttons && buttons.length > 1) {
            // Multi-button dialog - use confirm
            const confirmed = window.confirm(fullMessage);

            if (confirmed) {
                // Find first non-cancel button
                const confirmButton = buttons.find(b => b.style !== 'cancel');
                confirmButton?.onPress?.();
            } else {
                // Find cancel button
                const cancelButton = buttons.find(b => b.style === 'cancel');
                cancelButton?.onPress?.();
            }
        } else {
            // Single button - use alert
            window.alert(fullMessage);
            buttons?.[0]?.onPress?.();
        }
    } else {
        // For mobile, use native Alert
        Alert.alert(title, message, buttons);
    }
};

/**
 * Simple alert with OK button
 */
export const showSimpleAlert = (title: string, message?: string) => {
    showAlert(title, message, [{ text: 'OK' }]);
};

/**
 * Confirm dialog with Yes/No buttons
 */
export const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
) => {
    showAlert(title, message, [
        {
            text: 'Hủy',
            style: 'cancel',
            onPress: onCancel,
        },
        {
            text: 'Xác nhận',
            onPress: onConfirm,
        },
    ]);
};
