export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

export type FileValidation =
  | { ok: true }
  | { ok: false; status: 400 | 413 | 415; message: string };

export function validateImageFile(file: { type: string; size: number } | null | undefined): FileValidation {
  if (!file || file.size === 0) {
    return { ok: false, status: 400, message: "Please choose a screenshot to analyze." };
  }
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return { ok: false, status: 415, message: "Only PNG, JPG, or WEBP images are supported." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, status: 413, message: "This image is larger than 10 MB. Try a smaller screenshot." };
  }
  return { ok: true };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
