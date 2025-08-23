"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

type Toast = {
  id: number;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

type ToastContextType = {
  toast: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "rounded-md p-4 shadow-md text-sm transition-all animate-in slide-in-from-top-2",
              t.variant === "destructive"
                ? "bg-red-500 text-white"
                : "bg-primary text-white"
            )}
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.description && <div className="text-xs opacity-90">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
