import { useEffect, useState } from 'react';
import './Toast.css';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastItem = { id: number; message: string; type?: ToastType };

type ToastProps = {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
};

const DEFAULT_TOAST_DURATION_MS = 2000;
const TOAST_EXIT_ANIMATION_MS = 200;

/** Single toast bubble with auto-dismiss. */
const Toast = ({ message, type = 'info', duration = DEFAULT_TOAST_DURATION_MS, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), TOAST_EXIT_ANIMATION_MS);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon" aria-hidden>
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'warning' && '!'}
        {type === 'info' && 'i'}
      </span>
      <span className="toast-message">{message}</span>
    </div>
  );
};

export const ToastContainer = ({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: number) => void }) => (
  <div className="toast-container">
    {toasts.map(toast => (
      <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => onRemove(toast.id)} />
    ))}
  </div>
);

/** Manage a stack of toast notifications. */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  return {
    toasts,
    showToast,
    showSuccess: (message: string) => showToast(message, 'success'),
    showError: (message: string) => showToast(message, 'error'),
    showInfo: (message: string) => showToast(message, 'info'),
    showWarning: (message: string) => showToast(message, 'warning'),
    removeToast: (id: number) => setToasts(prev => prev.filter(t => t.id !== id)),
  };
}
