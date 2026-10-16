import { useSyncExternalStore } from "react";

export type UserTier = "guest" | "premium";

export interface UserProfile {
  tier: UserTier;
  name: string;
  email: string;
  dailyScreenshotLimit: number;
  checksUsedToday: number;
  lastResetDate: string;
}

const STORAGE_KEY = "scamlens_user_profile_v1";

export const DEFAULT_GUEST: UserProfile = {
  tier: "guest",
  name: "Guest User",
  email: "guest@scamlens.local",
  dailyScreenshotLimit: 3,
  checksUsedToday: 0,
  lastResetDate: new Date().toISOString().split("T")[0],
};

export const DEFAULT_PREMIUM: UserProfile = {
  tier: "premium",
  name: "Demo User (Premium)",
  email: "demo.subscriber@scamlens.com",
  dailyScreenshotLimit: Infinity,
  checksUsedToday: 0,
  lastResetDate: new Date().toISOString().split("T")[0],
};

type Listener = () => void;
const listeners = new Set<Listener>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

let cachedProfile: UserProfile | null = null;

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get current profile from localStorage with daily counter auto-reset
 */
export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_GUEST;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_GUEST;

    const parsed = JSON.parse(raw) as UserProfile;
    const today = getTodayString();

    // Auto-reset daily checks if it's a new day
    if (parsed.lastResetDate !== today) {
      parsed.lastResetDate = today;
      parsed.checksUsedToday = 0;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }

    return parsed;
  } catch {
    return DEFAULT_GUEST;
  }
}

/**
 * Switch or set user tier ("guest" | "premium")
 */
export function setUserTier(tier: UserTier): UserProfile {
  const current = getUserProfile();
  const today = getTodayString();

  const updated: UserProfile =
    tier === "premium"
      ? {
          tier: "premium",
          name: "Demo User (Premium)",
          email: "demo.subscriber@scamlens.com",
          dailyScreenshotLimit: Infinity,
          checksUsedToday: current.lastResetDate === today ? current.checksUsedToday : 0,
          lastResetDate: today,
        }
      : {
          tier: "guest",
          name: "Guest User",
          email: "guest@scamlens.local",
          dailyScreenshotLimit: 3,
          checksUsedToday: current.lastResetDate === today ? current.checksUsedToday : 0,
          lastResetDate: today,
        };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    /* storage unavailable */
  }

  cachedProfile = updated;
  emitChange();
  return updated;
}

/**
 * Increment the count of screenshot checks used today
 */
export function incrementChecksUsed(): { allowed: boolean; remaining: number; profile: UserProfile } {
  const profile = getUserProfile();

  if (profile.tier === "guest" && profile.checksUsedToday >= profile.dailyScreenshotLimit) {
    return { allowed: false, remaining: 0, profile };
  }

  const updated: UserProfile = {
    ...profile,
    checksUsedToday: profile.checksUsedToday + 1,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    /* storage unavailable */
  }

  cachedProfile = updated;
  emitChange();

  const remaining =
    updated.tier === "premium"
      ? Infinity
      : Math.max(0, updated.dailyScreenshotLimit - updated.checksUsedToday);

  return { allowed: true, remaining, profile: updated };
}

/**
 * Check if the user is allowed to perform a screenshot check
 */
export function canPerformCheck(profile?: UserProfile): boolean {
  const p = profile || getUserProfile();
  if (p.tier === "premium") return true;
  return p.checksUsedToday < p.dailyScreenshotLimit;
}

export function subscribeUserProfile(callback: () => void): () => void {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedProfile = null;
      callback();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

export function getUserProfileSnapshot(): UserProfile {
  if (cachedProfile === null) {
    cachedProfile = getUserProfile();
  }
  return cachedProfile;
}

export function getUserProfileServerSnapshot(): UserProfile {
  return DEFAULT_GUEST;
}

/**
 * React Hook to access and reactively track user profile & tier changes
 */
export function useUserProfile(): UserProfile {
  return useSyncExternalStore(
    subscribeUserProfile,
    getUserProfileSnapshot,
    getUserProfileServerSnapshot
  );
}
