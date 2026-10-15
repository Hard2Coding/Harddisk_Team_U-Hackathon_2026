"use client";

import { useRef, useState } from "react";
import { ImagePlus, RefreshCw, Trash2, Sparkles, Lock } from "lucide-react";
import { ACCEPTED_IMAGE_TYPES, formatBytes, validateImageFile } from "@/lib/file-validation";
import { cn } from "@/lib/utils";

interface Props {
  file: File | null;
  previewUrl: string | null;
  disabled?: boolean;
  onSelect: (file: File) => void;
  onClear: () => void;
  onError: (message: string) => void;
  onTryExample: () => void;
}

export function ScreenshotUploader({ file, previewUrl, disabled, onSelect, onClear, onError, onTryExample }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = (f: File | undefined | null) => {
    if (!f) return;
    const v = validateImageFile(f);
    if (!v.ok) {
      onError(v.message);
      return;
    }
    onSelect(f);
  };

  const openPicker = () => inputRef.current?.click();

  const input = (
    <input
      ref={inputRef}
      id="screenshot-input"
      type="file"
      accept={ACCEPTED_IMAGE_TYPES.join(",")}
      className="sr-only"
      onChange={(e) => {
        pick(e.target.files?.[0]);
        e.target.value = "";
      }}
    />
  );

  if (file && previewUrl) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-3 sm:p-4">
        {input}
        <div className="rounded-xl bg-soft overflow-hidden grid place-items-center max-h-105">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
          <img src={previewUrl} alt="Selected screenshot preview" className="max-h-105 w-auto object-contain" />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted">{formatBytes(file.size)}</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button
              type="button"
              id="replace-screenshot"
              onClick={openPicker}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-ink hover:bg-soft disabled:opacity-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Replace
            </button>
            <button
              type="button"
              id="remove-screenshot"
              onClick={onClear}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-muted hover:text-red-700 hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {input}
      <div
        role="button"
        tabIndex={0}
        id="screenshot-dropzone"
        aria-label="Upload a screenshot. Drag and drop or press Enter to choose a file."
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "cursor-pointer rounded-2xl border-2 border-dashed px-6 py-12 sm:py-14 text-center transition-all",
          dragging ? "border-ink bg-soft scale-[1.01]" : "border-line bg-surface hover:border-subtle",
        )}
      >
        <div className="mx-auto grid place-items-center w-12 h-12 rounded-xl bg-soft text-ink">
          <ImagePlus className="w-5.5 h-5.5" strokeWidth={1.8} />
        </div>
        <p className="mt-4 text-base font-medium">{dragging ? "Drop your screenshot here" : "Drag a screenshot here"}</p>
        <p className="mt-1 text-sm text-muted">or</p>
        <span className="mt-3 inline-flex items-center h-11 px-5 rounded-xl bg-ink text-white text-sm font-medium">
          Choose screenshot
        </span>
        <p className="mt-4 text-xs text-subtle">PNG, JPG or WEBP · up to 10 MB</p>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="inline-flex items-center gap-1.5 text-sm text-muted">
          <Lock className="w-3.5 h-3.5" /> Hide personal details before uploading.
        </p>
        <button
          type="button"
          id="try-example"
          onClick={onTryExample}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-ink hover:bg-soft transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" /> Try an example
        </button>
      </div>
    </div>
  );
}
