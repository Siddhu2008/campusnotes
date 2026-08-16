'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  showToast: () => {},
  removeToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', duration = 3500) => {
      const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const bgStyles = {
          success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
          error: 'bg-red-950/90 border-red-500/40 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.2)]',
          warning: 'bg-yellow-950/90 border-yellow-500/40 text-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.2)]',
          info: 'bg-indigo-950/90 border-indigo-500/40 text-indigo-200 shadow-[0_0_20px_rgba(99,102,241,0.2)]',
        }[toast.type];

        const icons = {
          success: '✅',
          error: '❌',
          warning: '⚠️',
          info: 'ℹ️',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl animate-fade-in-up text-xs font-medium ${bgStyles}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{icons}</span>
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-white/50 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
