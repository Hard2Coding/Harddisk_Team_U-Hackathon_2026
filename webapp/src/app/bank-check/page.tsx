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
} from "lucide-react";
import {
  MOCK_BANK_ACCOUNTS,
  ReportedBankAccount,
  searchBankAccounts,
} from "@/lib/mockBankAccounts";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 15;

const BANK_FILTERS = ["All Banks", "Bank A", "Bank B", "Bank C", "Bank D", "Bank E", "Bank F"];

export default function BankCheckPage() {
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ReportedBankAccount[] | null>(null);
  const [selectedBank, setSelectedBank] = useState("All Banks");
  const [currentPage, setCurrentPage] = useState(1);

  // Search handler
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults(null);
      setSearchedQuery("");
      return;
    }
    const results = searchBankAccounts(trimmed);
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
    const results = searchBankAccounts(accountNumber);
    setSearchResults(results);
    setSearchedQuery(accountNumber);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  // Filtered table data
  const filteredData = useMemo(() => {
    if (selectedBank === "All Banks") return MOCK_BANK_ACCOUNTS;
    return MOCK_BANK_ACCOUNTS.filter((acc) => acc.bankCompany === selectedBank);
  }, [selectedBank]);

  // Pagination calculations (max 15 list per page)
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handleBankFilterChange = (bank: string) => {
    setSelectedBank(bank);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 space-y-12">
      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 pb-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft border border-line text-xs font-medium text-muted mb-4">
          <Landmark className="w-3.5 h-3.5 text-ink" />
          <span>Scam Account Intelligence Database</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Bank Account Check</h1>
        <p className="mt-3 text-muted max-w-xl mx-auto leading-relaxed">
          Verify recipient account numbers, names, or banks against 100+ reported scam accounts before you transfer funds.
        </p>
      </section>

      {/* Search Bar Section */}
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
              Check Account
            </button>
          </div>
        </form>

        {/* Quick Click Samples */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted pt-1">
          <span className="text-subtle">Quick test samples:</span>
          {[
            "140-2-99881-0",
            "Somchai Rattanakorn",
            "450-1-66782-3",
            "999-9-99999-9", // Non-existent test
          ].map((sample) => (
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
                    This account matches {searchResults.length} verified scam report(s) in our database. It has been flagged as a suspicious mule account.
                  </p>
                </div>
              </div>

              {/* Matched Accounts List */}
              <div className="space-y-3 pt-2">
                {searchResults.map((acc) => (
                  <div
                    key={acc.id}
                    className="rounded-xl border border-red-200/90 bg-white p-4 text-sm text-slate-800 space-y-2 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-100 pb-2">
                      <span className="font-mono font-bold text-base text-red-700">{acc.accountNumber}</span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-red-100 text-red-800">
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
                        <span className="text-muted">Reported Victims: </span>
                        <strong className="text-red-700">{acc.reportsCount} reports ({acc.reportedDate})</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-red-800/90 flex items-center gap-2 pt-1">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>If someone asked you to send funds here, halt communication and report the details to your local anti-scam authority.</span>
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
      <section aria-labelledby="database-heading" className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h2 id="database-heading" className="text-xl font-semibold tracking-tight">
              Reported Scam Accounts Database
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Showing 100 flagged accounts · {filteredData.length} records in view · Max 15 per page
            </p>
          </div>

          {/* Bank Filters */}
          <div className="flex flex-wrap items-center gap-1">
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
                  <th scope="col" className="px-4 py-3">Scam Category</th>
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
                    <td className="px-4 py-3 text-xs text-muted">
                      {row.scamType}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-xs font-semibold text-red-700">
                      {row.reportsCount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[11px] font-semibold",
                          row.status === "Blacklisted"
                            ? "bg-red-50 text-red-700 ring-1 ring-red-200"
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
    </div>
  );
}
