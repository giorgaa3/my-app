"use client";

import { useCallback, useState } from "react";

import { createId } from "@/lib/id";
import type { ToastMessage, ToastTone } from "@/lib/types";

const TOAST_DURATION = 3200;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((toastId: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId),
    );
  }, []);

  const showToast = useCallback(
    (message: string, tone: ToastTone = "info") => {
      const toastId = createId("toast");

      setToasts((currentToasts) => [
        ...currentToasts,
        { id: toastId, message, tone },
      ]);

      window.setTimeout(() => dismissToast(toastId), TOAST_DURATION);
    },
    [dismissToast],
  );

  return {
    dismissToast,
    showToast,
    toasts,
  };
}
