"use client";

import { useSyncExternalStore } from "react";
import type { ScamAnalysis } from "./analysis-schema";

/**
 * Local-only check history (stored in this browser, never on the server).
 * Screenshots themselves are never stored — only the result and a short label.
 */
export interface HistoryEntry {
  id: string;
  createdAt: string;
  kind: "screenshot" | "text" | "url";
  label: string;
  analysis: ScamAnalysis;
}

const KEY = "scamlens_history_v1";
const LIMIT = 30;
const EMPTY: HistoryEntry[] = [];

const listeners = new Set<() => void>();
let cache: HistoryEntry[] | null = null;

function read(): HistoryEntry[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as HistoryEntry[]) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: HistoryEntry[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or unavailable — keep in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useHistory(): HistoryEntry[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function addHistory(entry: Omit<HistoryEntry, "id" | "createdAt">) {
  const item: HistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  write([item, ...read()].slice(0, LIMIT));
}

export function removeHistory(id: string) {
  write(read().filter((h) => h.id !== id));
}

export function clearHistory() {
  write(EMPTY);
}

/** Shorten and mask long digit runs (phone / account numbers) for display. */
export function maskLabel(text: string, max = 90): string {
  const masked = text.replace(/\d{4,}/g, (m) => `${m.slice(0, 2)}${"•".repeat(m.length - 4)}${m.slice(-2)}`);
  const single = masked.replace(/\s+/g, " ").trim();
  return single.length > max ? `${single.slice(0, max)}…` : single;
}
