import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <aside className="toast-container" aria-label="Notifications" aria-live="polite">
      {toasts.map((t) => {
        let icon = <Info size={16} aria-hidden="true" />;
        let typeClass = '';
        if (t.type === 'success') {
          icon = <CheckCircle2 size={16} aria-hidden="true" />;
          typeClass = 'toast-success';
        } else if (t.type === 'error') {
          icon = <AlertCircle size={16} aria-hidden="true" />;
          typeClass = 'toast-error';
        }

        return (
          <div
            key={t.id}
            className={`toast-message ${typeClass}`}
            onClick={() => onDismiss(t.id)}
            role="status"
          >
            {icon}
            <span>{t.message}</span>
          </div>
        );
      })}
    </aside>
  );
};
