import { Icon } from "@/components/ui/Icon";
import type { ToastMessage, ToastTone } from "@/lib/types";
import { cn } from "@/lib/utils";

type ToastViewportProps = {
  onDismiss: (toastId: string) => void;
  toasts: ToastMessage[];
};

const toastToneClasses: Record<ToastTone, string> = {
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export function ToastViewport({ onDismiss, toasts }: ToastViewportProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <div
          className={cn(
            "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur transition",
            toastToneClasses[toast.tone],
          )}
          key={toast.id}
          role="status"
        >
          <Icon
            name={toast.tone === "error" ? "alert" : "checkCircle"}
            className="mt-0.5 h-4 w-4 shrink-0"
          />
          <p className="min-w-0 flex-1 leading-6">{toast.message}</p>
          <button
            aria-label="Dismiss notification"
            className="rounded-md p-1 opacity-70 transition hover:bg-white/50 hover:opacity-100"
            onClick={() => onDismiss(toast.id)}
            type="button"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
