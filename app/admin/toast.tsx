"use client"

import { useEffect } from "react"
import { Icon } from "./icons"
import type { ToastMsg } from "./types"

export function Toast({
  message,
  type,
  onClose,
}: ToastMsg & { onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-4 ${
        type === "success"
          ? "bg-emerald-600 text-white"
          : "bg-red-600 text-white"
      }`}
    >
      {type === "success" ? <Icon.Check /> : <Icon.X />}
      {message}
    </div>
  );
}
