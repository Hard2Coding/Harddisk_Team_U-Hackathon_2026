"use client";

import { useState, useMemo } from "react";
import {
  Landmark,
  Search,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  X,
  FileWarning,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  Flag,
  Globe,
} from "lucide-react";
import {
  ReportedBankAccount,
  searchBankAccounts,
  useBankAccounts,
  saveCommunityReport,
} from "@/lib/mockBankAccounts";
import { addHistory } from "@/lib/history";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 15;

const BANK_FILTERS = [
  "All Banks",
  "Community Reported",
  "Bank A",
  "Bank B",
  "Bank C",
  "Bank D",
  "Bank E",
  "Bank F",
];

const SCAM_CATEGORIES = [
  "Online Marketplace Fraud",
  "Fake Investment / Crypto",
  "Telegram Task Scam",
  "Fake Loan Processing Fee",
  "Impersonation / Police Scam",
  "Romance Scam",
  "Job Offer Scam",
  "Ticket Resale Fraud",
  "Other Fraud",
];

export default function BankCheckPage() {
  const allAccounts = useBankAccounts();
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ReportedBankAccount[] | null>(null);
  const [selectedBank, setSelectedBank] = useState("All Banks");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state for Report Clue
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportSuccessMessage, setReportSuccessMessage] = useState<string | null>(null);

  // Report Form State
  const [reportAccountNum, setReportAccountNum] = useState("");
  const [reportName, setReportName] = useState("");
  const [reportBank, setReportBank] = useState("Bank A");
  const [reportCategory, setReportCategory] = useState(SCAM_CATEGORIES[0]);
  const [reportPlatform, setReportPlatform] = useState("");
  const [reportNotes, setReportNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search handler
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults(null);
      setSearchedQuery("");
      return;
    }
    const results = searchBankAccounts(trimmed, allAccounts);
    setSearchResults(results);
    setSearchedQuery(trimmed);
  };

  const handleClear = () => {
    setQuery("");
    setSearchedQuery("");
    setSearchResults(null);
  };

  const handleSelectExample = (accountNumber: string) => {
    setQuery(accountNumber);
    const results = searchBankAccounts(accountNumber, allAccounts);
    setSearchResults(results);
    setSearchedQuery(accountNumber);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  // Submit Community Report Clue
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNum = reportAccountNum.trim();
    if (!trimmedNum) return;

    setIsSubmitting(true);

    try {
      // 1. Save to database / localStorage
      const newReport = saveCommunityReport({
        accountNumber: trimmedNum,
        name: reportName.trim() || "Unspecified Account Holder",
        bankCompany: reportBank,
        scamType: reportCategory,
        platform: reportPlatform.trim() || undefined,
        notes: reportNotes.trim() || undefined,
      });

      // 2. Save into user's History store
      addHistory({
        kind: "bank_report",
        label: `Reported Clue: ${trimmedNum} (${reportBank})`,
        analysis: {
          riskLevel: "high",
          riskScore: 100,
          summary: `Community Scam Report: ${trimmedNum} (${newReport.name}) at ${reportBank}. Category: ${reportCategory}.${reportPlatform ? ` Reported on ${reportPlatform}.` : ""}`,
          indicators: [
            {
              type: "user_reported_scam",
              label: "Community Clue Submission",
              evidence: trimmedNum,
              explanation: `Report filed for fraudulent activity${reportPlatform ? ` on ${reportPlatform}` : ""}. Category: ${reportCategory}.${reportNotes ? ` Details: "${reportNotes}"` : ""}`,
              severity: "high",
            },
          ],
          recommendedActions: [
            "If you transferred funds, immediately call your bank's fraud department to request an emergency account freeze.",
            "Save and export all chat logs, transfer slips, and profile URLs as evidence.",
            "File a complaint with your national anti-online fraud police hotline (e.g. AOC 1441).",
          ],
          uncertainties: [
            "This entry was submitted as a community report clue and has been added to our watchlist database.",
          ],
          source: "rules",
        },
        reportDetails: {
          accountNumber: trimmedNum,
          accountName: newReport.name,
          bankCompany: reportBank,
          platform: reportPlatform.trim() || undefined,
          scamType: reportCategory,
          notes: reportNotes.trim() || undefined,
        },
      });

      // 4. Reset form & close modal
      setReportAccountNum("");
      setReportName("");
      setReportPlatform("");
      setReportNotes("");
      setIsReportModalOpen(false);

      // 5. Show banner & trigger search on newly reported account
      setReportSuccessMessage(`Account ${trimmedNum} has been added to our scam database and recorded in your History.`);
      setQuery(trimmedNum);
      setSearchedQuery(trimmedNum);
      setSearchResults([newReport]);
      window.scrollTo({ top: 120, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered table data
  const filteredData = useMemo(() => {
    if (selectedBank === "All Banks") return allAccounts;
    if (selectedBank === "Community Reported") {
      return allAccounts.filter((acc) => acc.status === "Community Reported");
    }
    return allAccounts.filter((acc) => acc.bankCompany === selectedBank);
  }, [allAccounts, selectedBank]);

  // Pagination calculations (max 15 list per page)
  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handleBankFilterChange = (bank: string) => {
    setSelectedBank(bank);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 space-y-10">
      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 pb-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft border border-line text-xs font-medium text-muted mb-4">
          <Landmark className="w-3.5 h-3.5 text-ink" />
          <span>Scam Account Intelligence Database</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Account Checker</h1>
        <p className="mt-3 text-muted max-w-xl mx-auto leading-relaxed">
          Verify recipient bank account numbers, names, or scam clues against reported accounts before you transfer funds.
        </p>
      </section>

      {/* Success Notification Banner */}
      {reportSuccessMessage && (
        <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center justify-between gap-3 animate-rise">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>{reportSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setReportSuccessMessage(null)}
            className="text-emerald-700/80 hover:text-emerald-950 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Actions Bar */}
      <section aria-label="Search bank account" className="mx-auto max-w-2xl space-y-3">
        <form onSubmit={handleSearch} className="relative">
          <div className="rounded-2xl border border-line bg-surface p-2 focus-within:border-subtle shadow-xs transition-all flex items-center gap-2">
            <Search className="w-5 h-5 ml-3 text-subtle shrink-0" />
            <input
              type="text"
              id="bank-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter account number (e.g. 140-2-99881-0), name, or bank..."
              className="w-full h-11 bg-transparent text-base outline-none placeholder:text-subtle"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="p-1 rounded-lg text-subtle hover:text-ink hover:bg-soft transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              id="bank-search-button"
              className="inline-flex items-center justify-center h-11 px-5 rounded-xl bg-ink text-white text-sm font-medium hover:bg-ink/90 shrink-0 transition-colors"
            >
              Check
            </button>
          </div>
        </form>

        {/* Quick Click Samples & Report Clue CTA Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-subtle">Quick test:</span>
            {["140-2-99881-0", "Somchai Rattanakorn", "450-1-66782-3"].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => handleSelectExample(sample)}
                className="px-2.5 py-1 rounded-lg border border-line bg-surface hover:bg-soft text-ink font-mono text-xs transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>

          <button
            type="button"
            id="open-report-modal"
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-medium border border-red-200 transition-colors self-start sm:self-auto shrink-0 shadow-2xs"
          >
            <Flag className="w-3.5 h-3.5 text-red-600" />
            <span>+ Report Scam Clue</span>
          </button>
        </div>
      </section>

      {/* Search Results Display */}
      {searchedQuery && searchResults !== null && (
        <section aria-labelledby="search-result-heading" className="mx-auto max-w-2xl animate-rise">
          {searchResults.length > 0 ? (
            /* FOUND DANGER ALERT */
            <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5 sm:p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="grid place-items-center w-12 h-12 rounded-xl bg-red-100 text-red-600 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-red-600 text-white">
                      Warning: Scam Report Found
                    </span>
                  </div>
                  <h2 id="search-result-heading" className="text-xl font-bold text-red-950">
                    Do NOT transfer money to this account!
                  </h2>
                  <p className="text-sm text-red-800 leading-relaxed">
                    This account matches {searchResults.length} reported record(s) in our database. It has been flagged as a fraudulent or mule account.
                  </p>
                </div>
              </div>

              {/* Matched Accounts List */}
              <div className="space-y-3 pt-2">
                {searchResults.map((acc) => (
                  <div
                    key={acc.id}
                    className="rounded-xl border border-red-200/90 bg-white p-4 text-sm text-slate-800 space-y-2.5 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-100 pb-2">
                      <span className="font-mono font-bold text-base text-red-700">{acc.accountNumber}</span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-xs font-semibold",
                          acc.status === "Community Reported"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-red-100 text-red-800"
                        )}
                      >
                        {acc.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted">Account Name: </span>
                        <strong className="text-ink">{acc.name}</strong>
                      </div>
                      <div>
                        <span className="text-muted">Bank Company: </span>
                        <strong className="text-ink">{acc.bankCompany}</strong>
                      </div>
                      <div>
                        <span className="text-muted">Scam Category: </span>
                        <strong className="text-red-700">{acc.scamType}</strong>
                      </div>
                      <div>
                        <span className="text-muted">Reported Activity: </span>
                        <strong className="text-red-700">
                          {acc.reportsCount} report(s) · {acc.reportedDate}
                        </strong>
                      </div>
                      {acc.platform && (
                        <div className="sm:col-span-2 flex items-center gap-1.5 text-xs text-slate-600">
                          <Globe className="w-3.5 h-3.5 text-muted" />
                          <span>Reported Scam Platform: </span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-900">
                            {acc.platform}
                          </span>
                        </div>
                      )}
                      {acc.notes && (
                        <div className="sm:col-span-2 text-xs text-muted italic bg-slate-50 p-2 rounded-lg">
                          &ldquo;{acc.notes}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-red-800/90 flex items-center gap-2 pt-1">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>Halt all payments immediately. Legitimate companies never instruct clients to pay personal mule accounts.</span>
              </div>
            </div>
          ) : (
            /* NOT FOUND CLEAR NOTICE */
            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 space-y-3">
              <div className="flex items-start gap-4">
                <div className="grid place-items-center w-11 h-11 rounded-xl bg-soft text-muted shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="min-w-0 space-y-1">
                  <h2 id="search-result-heading" className="text-lg font-semibold text-ink">
                    No scam reports found for &ldquo;{searchedQuery}&rdquo;
                  </h2>
                  <p className="text-sm text-muted leading-relaxed">
                    This account is not currently listed in our blacklist database.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-soft p-4 text-xs text-muted leading-relaxed space-y-1.5 border border-line/60">
                <p className="font-medium text-ink flex items-center gap-1.5">
                  <FileWarning className="w-3.5 h-3.5 text-amber-600" /> Important Precaution:
                </p>
                <p>
                  Zero past reports does <strong>not guarantee</strong> safety. Scammers frequently open and rotate new bank accounts (mules) daily before victims file initial reports.
                </p>
                <ul className="list-disc pl-4 space-y-1 pt-1">
                  <li>Confirm the recipient name matches the official company or verified business registration.</li>
                  <li>Never transfer deposits for &ldquo;urgent prizes&rdquo;, unverified loan approvals, or private investment tips.</li>
                </ul>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Database Table Section */}
      <section aria-labelledby="database-heading" className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h2 id="database-heading" className="text-xl font-semibold tracking-tight">
              Reported Scam Accounts Database
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Showing {allAccounts.length} flagged accounts · {filteredData.length} records in current filter · Max 15 per page
            </p>
          </div>

          {/* Bank / Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {BANK_FILTERS.map((bank) => (
              <button
                key={bank}
                type="button"
                onClick={() => handleBankFilterChange(bank)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  selectedBank === bank
                    ? "bg-ink text-white"
                    : "bg-surface border border-line text-muted hover:text-ink hover:bg-soft"
                )}
              >
                {bank}
              </button>
            ))}
          </div>
        </div>

        {/* The 15-Item-Per-Page Table */}
        <div className="rounded-2xl border border-line bg-surface overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-soft border-b border-line text-xs font-medium text-muted uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3 w-12 text-center">#</th>
                  <th scope="col" className="px-4 py-3">Bank Company</th>
                  <th scope="col" className="px-4 py-3">Account Number</th>
                  <th scope="col" className="px-4 py-3">Reported Name</th>
                  <th scope="col" className="px-4 py-3">Category & Platform</th>
                  <th scope="col" className="px-4 py-3 text-center">Reports</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {paginatedData.map((row) => (
                  <tr key={row.id} className="hover:bg-soft/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-subtle text-center font-mono">
                      {row.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        {row.bankCompany}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-red-700">
                      {row.accountNumber}
                    </td>
                    <td className="px-4 py-3 text-ink font-medium">
                      {row.name}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="font-medium text-slate-800">{row.scamType}</div>
                      {row.platform && (
                        <div className="text-[11px] text-purple-700 flex items-center gap-1 mt-0.5">
                          <span>via</span>
                          <span className="font-semibold">{row.platform}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-xs font-semibold text-red-700">
                      {row.reportsCount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap",
                          row.status === "Blacklisted"
                            ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                            : row.status === "Community Reported"
                            ? "bg-purple-50 text-purple-700 ring-1 ring-purple-200"
                            : row.status === "Flagged Mule"
                            ? "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
                            : "bg-stone-100 text-stone-700 ring-1 ring-stone-200"
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleSelectExample(row.accountNumber)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-ink bg-soft hover:bg-line transition-colors"
                      >
                        Check <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer with 15 list per page pagination */}
          <div className="px-5 py-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
            <div>
              Showing <span className="font-medium text-ink">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="font-medium text-ink">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
              </span>{" "}
              of <span className="font-medium text-ink">{filteredData.length}</span> reported accounts
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-line bg-surface hover:bg-soft disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "min-w-8 h-8 rounded-lg text-xs font-medium transition-colors",
                    currentPage === page
                      ? "bg-ink text-white"
                      : "border border-line bg-surface hover:bg-soft text-ink"
                  )}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-line bg-surface hover:bg-soft disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* REPORT SCAM CLUE MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-rise">
          <div className="w-full max-w-lg rounded-3xl bg-surface border border-line shadow-xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <Flag className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-ink">Report a Scam Account Clue</h3>
                  <p className="text-xs text-muted">Contribute to the scam database and protect other users</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-soft"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              {/* Account Number */}
              <div>
                <label htmlFor="report-account-num" className="block text-xs font-medium text-ink mb-1">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="report-account-num"
                  type="text"
                  required
                  value={reportAccountNum}
                  onChange={(e) => setReportAccountNum(e.target.value)}
                  placeholder="e.g. 140-2-99881-0 or digits"
                  className="w-full h-10 px-3 rounded-xl border border-line bg-canvas text-sm font-mono outline-none focus:border-ink"
                />
              </div>

              {/* Account Owner Name */}
              <div>
                <label htmlFor="report-name" className="block text-xs font-medium text-ink mb-1">
                  Account Owner Name (if known)
                </label>
                <input
                  id="report-name"
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="e.g. John Doe or store name"
                  className="w-full h-10 px-3 rounded-xl border border-line bg-canvas text-sm outline-none focus:border-ink"
                />
              </div>

              {/* Bank Company & Scam Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="report-bank" className="block text-xs font-medium text-ink mb-1">
                    Bank Company <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="report-bank"
                    value={reportBank}
                    onChange={(e) => setReportBank(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-line bg-canvas text-sm outline-none focus:border-ink"
                  >
                    <option value="Bank A">Bank A</option>
                    <option value="Bank B">Bank B</option>
                    <option value="Bank C">Bank C</option>
                    <option value="Bank D">Bank D</option>
                    <option value="Bank E">Bank E</option>
                    <option value="Bank F">Bank F</option>
                    <option value="Other Bank">Other Bank</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="report-category" className="block text-xs font-medium text-ink mb-1">
                    Scam Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="report-category"
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-line bg-canvas text-sm outline-none focus:border-ink"
                  >
                    {SCAM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Scam Platform (Optional) */}
              <div>
                <label htmlFor="report-platform" className="block text-xs font-medium text-ink mb-1">
                  Scam Platform <span className="text-muted">(Optional)</span>
                </label>
                <input
                  id="report-platform"
                  type="text"
                  value={reportPlatform}
                  onChange={(e) => setReportPlatform(e.target.value)}
                  placeholder="e.g. Telegram, Facebook Marketplace, TikTok, Line, SMS"
                  className="w-full h-10 px-3 rounded-xl border border-line bg-canvas text-sm outline-none focus:border-ink"
                />
              </div>

              {/* Incident Notes (Optional) */}
              <div>
                <label htmlFor="report-notes" className="block text-xs font-medium text-ink mb-1">
                  Incident Details <span className="text-muted">(Optional)</span>
                </label>
                <textarea
                  id="report-notes"
                  rows={2}
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="Briefly describe what happened..."
                  className="w-full p-3 rounded-xl border border-line bg-canvas text-sm outline-none focus:border-ink resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted hover:text-ink hover:bg-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !reportAccountNum.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-ink text-white text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Clue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
