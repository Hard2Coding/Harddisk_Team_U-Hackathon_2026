import { MOCK_BANK_ACCOUNTS, ReportedBankAccount } from "./bankAccountsData";
import { SAMPLE_THREAT_RECORDS } from "./scamEngine";
import { MatchedBankAccount, ScamAnalysis } from "./analysis-schema";

/**
 * Extracts potential bank account numbers, PromptPay phone numbers, or citizen IDs from text.
 * Handles formats like:
 * - 140-2-99881-0 or 1402998810 (10-12 digits with or without dashes)
 * - PromptPay phone: 0891234567 or 089-123-4567
 * - PromptPay citizen ID: 13 digits
 */
export function extractBankAccountsFromText(text: string): string[] {
  const accounts: string[] = [];
  const seen = new Set<string>();

  // 1. Formatted bank account e.g. 140-2-99881-0, 089-123-4567
  const dashedRegex = /\b\d{3}[-\s]\d{1,2}[-\s]\d{4,5}[-\s]\d{1}\b/g;
  let match: RegExpExecArray | null;
  while ((match = dashedRegex.exec(text)) !== null) {
    const val = match[0].trim();
    if (!seen.has(val)) {
      seen.add(val);
      accounts.push(val);
    }
  }

  // 2. Unformatted 10 to 12 digit bank account numbers
  const digitsRegex = /\b\d{10,12}\b/g;
  while ((match = digitsRegex.exec(text)) !== null) {
    const val = match[0].trim();
    if (!seen.has(val)) {
      seen.add(val);
      accounts.push(val);
    }
  }

  // 3. PromptPay phone numbers (10 digits starting with 06, 08, 09)
  const phoneRegex = /\b0[689]\d{8}\b|\b0[689]\d[-\s]\d{3}[-\s]\d{4}\b/g;
  while ((match = phoneRegex.exec(text)) !== null) {
    const val = match[0].trim();
    if (!seen.has(val)) {
      seen.add(val);
      accounts.push(val);
    }
  }

  return accounts;
}

/**
 * Normalizes an account or phone number by stripping spaces and dashes.
 */
export function normalizeAccount(acc: string): string {
  return acc.replace(/[\s-]/g, "").trim();
}

/**
 * Searches the bank account scam database for a match.
 * Cross-references MOCK_BANK_ACCOUNTS and SAMPLE_THREAT_RECORDS.
 */
export function lookupBankAccountThreat(query: string): MatchedBankAccount | null {
  if (!query || !query.trim()) return null;
  const clean = normalizeAccount(query);
  if (clean.length < 8) return null;

  // 1. Check in MOCK_BANK_ACCOUNTS
  for (const item of MOCK_BANK_ACCOUNTS) {
    const itemClean = normalizeAccount(item.accountNumber);
    if (itemClean === clean || item.accountNumber.includes(query.trim())) {
      return {
        accountNumber: item.accountNumber,
        name: item.name,
        bankCompany: item.bankCompany,
        scamType: item.scamType,
        reportsCount: item.reportsCount,
        status: item.status,
        reportedDate: item.reportedDate,
      };
    }
  }

  // 2. Check in SAMPLE_THREAT_RECORDS
  for (const rec of SAMPLE_THREAT_RECORDS) {
    if (rec.type === "account" || rec.type === "wallet" || rec.type === "phone") {
      const recClean = normalizeAccount(rec.value);
      if (recClean === clean || rec.value === query.trim()) {
        return {
          accountNumber: rec.value,
          name: "Flagged Threat Subject",
          bankCompany: rec.type === "wallet" ? "PromptPay Wallet" : "Flagged Bank",
          scamType: rec.evidence,
          reportsCount: 15,
          status: rec.status === "confirmed" ? "Blacklisted" : "Flagged Mule",
          reportedDate: new Date().toISOString().split("T")[0],
        };
      }
    }
  }

  return null;
}

/**
 * Checks a list of candidate account numbers and returns any matches found in the database.
 */
export function checkMultipleBankAccounts(candidates: string[]): MatchedBankAccount[] {
  const matches: MatchedBankAccount[] = [];
  const seen = new Set<string>();

  for (const cand of candidates) {
    const found = lookupBankAccountThreat(cand);
    if (found && !seen.has(found.accountNumber)) {
      seen.add(found.accountNumber);
      matches.push(found);
    }
  }

  return matches;
}

/**
 * Generates structured context string to inject into LLM prompts.
 * Drastically reduces token usage and prevents hallucinations by providing ground truth.
 */
export function formatBankMatchForPrompt(match: MatchedBankAccount): string {
  return `[VERIFIED THREAT DATABASE MATCH - DO NOT IGNORE]
Account Number: ${match.accountNumber}
Account Name: ${match.name}
Bank / Provider: ${match.bankCompany}
Threat Status: ${match.status}
Reported Cases: ${match.reportsCount} victim reports
Scam Category: ${match.scamType}
Ground truth rule: This account is confirmed on the national fraud / mule account watchlist. Escalate risk score to >= 95 and strongly instruct the user not to transfer money.`;
}

/**
 * Enriches a ScamAnalysis with bank threat database results.
 */
export function enrichAnalysisWithBankMatches(
  analysis: ScamAnalysis,
  matches: MatchedBankAccount[]
): ScamAnalysis {
  if (!matches || matches.length === 0) {
    return analysis;
  }

  const primary = matches[0];
  const updatedIndicators = [...analysis.indicators];

  // Check if bank account indicator already exists
  const hasBankInd = updatedIndicators.some(
    (i) => i.type === "blacklisted_bank_account" || i.evidence.includes(primary.accountNumber)
  );

  if (!hasBankInd) {
    updatedIndicators.unshift({
      type: "blacklisted_bank_account",
      label: `🚨 Blacklisted Scam Bank Account (${primary.status})`,
      evidence: `${primary.accountNumber} — ${primary.name} (${primary.bankCompany})`,
      explanation: `Verified match in threat database with ${primary.reportsCount} fraud reports for "${primary.scamType}".`,
      severity: "high",
    });
  }

  const updatedActions = [...analysis.recommendedActions];
  const transferWarning = `DO NOT TRANSFER MONEY to ${primary.accountNumber} (${primary.name}): Confirmed on the fraud blacklist.`;
  if (!updatedActions.some((a) => a.includes("DO NOT TRANSFER"))) {
    updatedActions.unshift(transferWarning);
  }

  return {
    ...analysis,
    riskLevel: "high",
    riskScore: Math.max(analysis.riskScore || 0, 98),
    summary: `🚨 HIGH THREAT: Contains confirmed scam/mule bank account ${primary.accountNumber} (${primary.name}, ${primary.bankCompany}) flagged for ${primary.scamType}.`,
    indicators: updatedIndicators.slice(0, 5),
    recommendedActions: updatedActions.slice(0, 5),
    matchedBankAccounts: matches,
  };
}
