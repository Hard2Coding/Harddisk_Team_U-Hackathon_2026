"use client";

import { useSyncExternalStore } from "react";
import { ReportedBankAccount, MOCK_BANK_ACCOUNTS } from "./bankAccountsData";
export type { ReportedBankAccount };
export { MOCK_BANK_ACCOUNTS };

export const COMMUNITY_REPORTS_KEY = "scamlens_community_bank_reports_v1";

type Listener = () => void;
const listeners = new Set<Listener>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

let cachedAccounts: ReportedBankAccount[] | null = null;

/**
 * Retrieve user/community reported bank accounts from browser storage
 */
export function getCommunityReportedAccounts(): ReportedBankAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMMUNITY_REPORTS_KEY);
    return raw ? (JSON.parse(raw) as ReportedBankAccount[]) : [];
  } catch {
    return [];
  }
}

/**
 * Save a newly reported bank account clue to browser storage
 */
export function saveCommunityReport(report: {
  accountNumber: string;
  name: string;
  bankCompany: string;
  scamType: string;
  platform?: string;
  notes?: string;
}): ReportedBankAccount {
  const existing = getCommunityReportedAccounts();
  const newAccount: ReportedBankAccount = {
    id: 100 + existing.length + 1,
    accountNumber: report.accountNumber.trim(),
    name: report.name.trim() || "Unspecified Account Holder",
    bankCompany: report.bankCompany.trim(),
    scamType: report.scamType.trim(),
    platform: report.platform?.trim() || undefined,
    notes: report.notes?.trim() || undefined,
    reportsCount: 1,
    reportedDate: new Date().toISOString().split("T")[0],
    status: "Community Reported",
  };

  const updated = [newAccount, ...existing];
  try {
    localStorage.setItem(COMMUNITY_REPORTS_KEY, JSON.stringify(updated));
  } catch {
    /* storage unavailable */
  }
  cachedAccounts = [...updated, ...MOCK_BANK_ACCOUNTS];
  emitChange();
  return newAccount;
}

/**
 * Combined dataset containing both community reported clues and verified database records
 */
export function getAllBankAccounts(): ReportedBankAccount[] {
  const community = getCommunityReportedAccounts();
  return [...community, ...MOCK_BANK_ACCOUNTS];
}

export function subscribeBankAccounts(callback: () => void): () => void {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === COMMUNITY_REPORTS_KEY) {
      cachedAccounts = null;
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

export function getBankAccountsSnapshot(): ReportedBankAccount[] {
  if (cachedAccounts === null) {
    cachedAccounts = getAllBankAccounts();
  }
  return cachedAccounts;
}

export function getBankAccountsServerSnapshot(): ReportedBankAccount[] {
  return MOCK_BANK_ACCOUNTS;
}

/**
 * React hook to synchronize bank accounts in real time across components & storage
 */
export function useBankAccounts(): ReportedBankAccount[] {
  return useSyncExternalStore(
    subscribeBankAccounts,
    getBankAccountsSnapshot,
    getBankAccountsServerSnapshot
  );
}

/**
 * Searches the bank account blacklist by query:
 * Matches account number (with or without dashes/spaces), account owner name, bank company, or scam platform.
 */
export function searchBankAccounts(query: string, customList?: ReportedBankAccount[]): ReportedBankAccount[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const digitsOnlyQuery = cleanQuery.replace(/[\s-]/g, "");
  const list = customList || getAllBankAccounts();

  return list.filter((acc) => {
    const cleanAccNum = acc.accountNumber.replace(/[\s-]/g, "");
    const matchNum = cleanAccNum.includes(digitsOnlyQuery) || acc.accountNumber.toLowerCase().includes(cleanQuery);
    const matchName = acc.name.toLowerCase().includes(cleanQuery);
    const matchBank = acc.bankCompany.toLowerCase().includes(cleanQuery);
    const matchPlatform = acc.platform ? acc.platform.toLowerCase().includes(cleanQuery) : false;

    return matchNum || matchName || matchBank || matchPlatform;
  });
}

