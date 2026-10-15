import { AlertCircle, X } from "lucide-react";

export function ErrorMessage({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div
      role="alert"
      className="animate-rise flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <AlertCircle className="w-4.5 h-4.5 mt-0.5 shrink-0" />
      <p className="flex-1 leading-relaxed">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="p-0.5 rounded-md text-red-700/70 hover:text-red-900"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
