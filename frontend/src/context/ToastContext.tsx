import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  const colors: Record<ToastType, string> = {
    success: 'border-brand-500 bg-brand-500/10 text-brand-400',
    error: 'border-red-500 bg-red-500/10 text-red-400',
    info: 'border-blue-500 bg-blue-500/10 text-blue-400',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium
              shadow-lg backdrop-blur-sm animate-fade-up pointer-events-auto ${colors[toast.type]}`}
          >
            <span className="text-base leading-none">{icons[toast.type]}</span>
            <span className="text-slate-200">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
