import { create } from 'zustand';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface ConfirmDialog {
  isOpen: boolean;
  title: string;
  message: string;
  severity?: 'warning' | 'danger' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
}

interface NotificationState {
  toasts: Toast[];
  confirmDialog: ConfirmDialog | null;
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  dismissToast: (id: string) => void;
  showConfirm: (title: string, message: string, severityOrConfirm: (() => void) | 'warning' | 'danger' | 'info', onConfirmOrCancel?: (() => void) | null, onCancel?: () => void) => void;
  dismissConfirm: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  toasts: [],
  confirmDialog: null,

  showToast: (message, type = 'info', duration = 2500) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, type, message, duration };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    if (duration > 0) {
      setTimeout(() => {
        get().dismissToast(id);
      }, duration);
    }
  },

  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  },

  showConfirm: (title, message, severityOrConfirm, onConfirmOrCancel, onCancel) => {
    const severity = typeof severityOrConfirm === 'string' ? severityOrConfirm : undefined;
    const onConfirm = typeof severityOrConfirm === 'function' ? severityOrConfirm : (onConfirmOrCancel as () => void);
    const cancelFn = typeof severityOrConfirm === 'function' ? (onConfirmOrCancel as (() => void) | undefined) : onCancel;
    set({
      confirmDialog: {
        isOpen: true,
        title,
        message,
        severity,
        onConfirm: () => {
          onConfirm();
          get().dismissConfirm();
        },
        onCancel: () => {
          if (cancelFn) cancelFn();
          get().dismissConfirm();
        }
      }
    });
  },

  dismissConfirm: () => {
    set({ confirmDialog: null });
  }
}));
