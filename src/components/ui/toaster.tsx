"use client";
import { useEffect, useState } from "react";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

let toastListeners: ((toast: Toast) => void)[] = [];

export function toast(message: string, type: Toast["type"] = "info") {
  const id = Math.random().toString(36).slice(2);
  toastListeners.forEach((fn) => fn({ id, message, type }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl text-white font-medium text-sm animate-fade-up ${
            toast.type === "success"
              ? "bg-green-600"
              : toast.type === "error"
              ? "bg-red-500"
              : "bg-gray-800"
          }`}
        >
          <span>
            {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "ℹ️"}
          </span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
