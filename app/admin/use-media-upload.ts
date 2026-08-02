"use client"

import { useCallback } from "react"
import type { ToastMsg } from "./types"

export function useMediaUpload(toast: (t: ToastMsg) => void) {
  return useCallback(
    async (file: File, alt: string): Promise<string | null> => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("alt", alt);
      const res = await fetch("/api/media", { method: "POST", body: fd });
      if (res.ok) {
        const m = await res.json();
        toast({ message: "Image uploaded", type: "success" });
        return m.url;
      }
      return null;
    },
    [toast]
  );
}
