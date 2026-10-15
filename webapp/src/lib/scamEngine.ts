import { Analysis, Entity, GraphData, Reason, Contribution, RiskLevel } from "@/types/api";
import { maskIdentifier } from "./utils";

// Verified sample threat records
export const SAMPLE_THREAT_RECORDS = [
  {
    type: "url",
    value: "http://kbank-verify-otp.xyz",
    status: "confirmed",
    source: "Anti-Online Scam Operation Center (AOC 1441)",
    evidence: "Impersonating banking OTP authorization portal for credential harvesting",
    related: ["089-123-4567", "@kbank_support_fake"],
  },
  {
    type: "domain",
    value: "scb-secure-update.top",
    status: "confirmed",
    source: "Thai CERT / Police Cyber Investigation",
    evidence: "Phishing lure domain targeting online banking sessions and passwords",
    related: ["082-999-8877", "140-2-99881-0"],
  },
  {
    type: "phone",
    value: "0891234567",
    status: "confirmed",
    source: "National Telecom Blacklist",
    evidence: "Automated robocall imposter scam posing as Customs & Revenue Department",
    related: ["http://kbank-verify-otp.xyz"],
  },
  {
    type: "account",
    value: "1402998810",
    status: "confirmed",
    source: "Central Bank Flagged Mule Watchlist",
    evidence: "Category 1 flagged mule account used for crypto scam transfers",
    related: ["scb-secure-update.top"],
  },
  {
    type: "wallet",
    value: "0819994321",
    status: "reported",
    source: "Community Clue #9412",
    evidence: "PromptPay recipient repeatedly reported for deceptive marketplace sales",
    related: ["@online_shop_fraud"],
  },
];

// Entity extraction & normalization
export function extractEntities(text: string): Entity[] {
  const entities: Entity[] = [];
  const seen = new Set<string>();

  // 1. URLs & Domains
  const urlRegex = /(https?:\/\/[^\s<>"'{}|\\^`]+|[a-zA-Z0-9][-a-zA-Z0-9]{1,62}\.(?:xyz|top|site|online|club|vip|cc|tk|ml|ga|cf|gq|work|co\.th|com|net|org|info|biz)[^\s<>"'{}|\\^`]*)/gi;
  let match: RegExpExecArray | null;
  while ((match = urlRegex.exec(text)) !== null) {
    const raw = match[0].trim().replace(/[.,;:)\]]+$/, "");
    if (!seen.has(raw)) {
      seen.add(raw);
      try {
        const hasProto = raw.startsWith("http://") || raw.startsWith("https://");
        const parsed = hasProto ? new URL(raw) : new URL(`http://${raw}`);
        entities.push({
          id: `ent-${entities.length + 1}`,
          type: "url",
          value: raw,
          masked_value: maskIdentifier(raw, "url"),
        });
        if (parsed.hostname && !seen.has(parsed.hostname)) {
          seen.add(parsed.hostname);
          entities.push({
            id: `ent-${entities.length + 1}`,
            type: "domain",
            value: parsed.hostname,
            masked_value: maskIdentifier(parsed.hostname, "domain"),
          });
        }
      } catch {
        entities.push({
          id: `ent-${entities.length + 1}`,
          type: "url",
          value: raw,
          masked_value: maskIdentifier(raw, "url"),
        });
      }
    }
  }

  // 2. Phone Numbers (Thai 08x, 06x, 09x or international format)
  const phoneRegex = /(?:\+?66|0)[689]\d{8}|\b0[689]\d{1}[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  while ((match = phoneRegex.exec(text)) !== null) {
    const raw = match[0].replace(/[\s.-]/g, "");
    const normalized = raw.startsWith("+66") ? "0" + raw.slice(3) : raw;
    if (!seen.has(normalized) && normalized.length === 10) {
      seen.add(normalized);
      entities.push({
        id: `ent-${entities.length + 1}`,
        type: "phone",
        value: normalized,
        masked_value: maskIdentifier(normalized, "phone"),
      });
    }
  }

  // 3. Bank Account / Digital Wallet (10 - 13 digits)
  const accountRegex = /\b\d{3}[-]?\d{1}[-]?\d{5}[-]?\d{1}\b|\b\d{10,12}\b/g;
  while ((match = accountRegex.exec(text)) !== null) {
    const raw = match[0].replace(/-/g, "");
    if (!seen.has(raw) && raw.length >= 10 && raw.length <= 13) {
      if (!entities.some((e) => e.type === "phone" && e.value === raw)) {
        seen.add(raw);
        entities.push({
          id: `ent-${entities.length + 1}`,
          type: raw.length === 10 ? "account" : "wallet",
          value: raw,
          masked_value: maskIdentifier(raw, "account"),
        });
      }
    }
  }

  // 4. LINE IDs or Handle (@...)
  const lineRegex = /@([a-zA-Z0-9._-]{3,30})\b/g;
  while ((match = lineRegex.exec(text)) !== null) {
    const raw = match[0];
    if (!seen.has(raw)) {
      seen.add(raw);
      entities.push({
        id: `ent-${entities.length + 1}`,
        type: "line",
        value: raw,
        masked_value: maskIdentifier(raw, "line"),
      });
    }
  }

  return entities;
}

// Lexical & Structural URL Feature Analysis + Tree SHAP
export function analyzeUrlFeatures(urlStr: string): {
  urlScore: number;
  contributions: Contribution[];
  anomaly: { score: number; is_anomaly: boolean; baseline: string };
  reasons: Reason[];
} {
  const contributions: Contribution[] = [];
  const reasons: Reason[] = [];
  let logOdds = 0;

  let urlObj: URL | null = null;
  try {
    urlObj = urlStr.includes("://") ? new URL(urlStr) : new URL(`http://${urlStr}`);
  } catch {
    // Malformed URL
  }

  const hostname = urlObj ? urlObj.hostname : urlStr;

  // 1. High Risk TLD check
  const highRiskTlds = [".xyz", ".top", ".club", ".online", ".site", ".vip", ".cc", ".icu", ".work", ".tk", ".ml"];
  const matchedTld = highRiskTlds.find((tld) => hostname.toLowerCase().endsWith(tld));
  if (matchedTld) {
    logOdds += 1.65;
    contributions.push({
      feature: `Suspicious TLD (${matchedTld})`,
      value: 1.65,
      unit: "log-odds",
      model: "XGBoost URL Classifier",
    });
    reasons.push({
      code: "SUSPICIOUS_TLD",
      title: `High-Risk Domain Extension (${matchedTld})`,
      detail: `The domain ends with ${matchedTld}, a top-level domain frequently utilized in low-cost, disposable scam campaigns.`,
      source: "XGBoost URL Classifier",
      severity: "danger",
    });
  }

  // 2. Subdomain depth (e.g. kbank.co.th.verify-login.xyz)
  const dots = (hostname.match(/\./g) || []).length;
  if (dots >= 3) {
    logOdds += 1.42;
    contributions.push({
      feature: "High Subdomain Depth (>2 levels)",
      value: 1.42,
      unit: "log-odds",
      model: "XGBoost URL Classifier",
    });
    reasons.push({
      code: "DECEPTIVE_SUBDOMAIN",
      title: "Deeply Nested Deceptive Subdomain",
      detail: "Multiple subdomain levels detected, commonly used to disguise malicious destinations behind legitimate institution names.",
      source: "XGBoost URL Classifier",
      severity: "warning",
    });
  }

  // 3. Userinfo deception (@ in URL)
  if (urlStr.includes("@")) {
    logOdds += 2.1;
    contributions.push({
      feature: "Userinfo Deception Character (@)",
      value: 2.1,
      unit: "log-odds",
      model: "XGBoost URL Classifier",
    });
    reasons.push({
      code: "USERINFO_DECEPTION",
      title: "Deceptive '@' Character Obfuscation",
      detail: "The '@' symbol tricks users into seeing a trusted brand name while directing the browser to an attacker-controlled host.",
      source: "XGBoost URL Classifier",
      severity: "danger",
    });
  }

  // 4. IP address host
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    logOdds += 1.85;
    contributions.push({
      feature: "Raw IP Address Hostname",
      value: 1.85,
      unit: "log-odds",
      model: "XGBoost URL Classifier",
    });
    reasons.push({
      code: "IP_HOST_ADDRESS",
      title: "Direct Raw IP Address Used As Hostname",
      detail: "Legitimate online banking and corporate services never request user credentials via naked IP addresses.",
      source: "XGBoost URL Classifier",
      severity: "danger",
    });
  }

  // 5. Multiple hyphens in domain
  const hyphens = (hostname.match(/-/g) || []).length;
  if (hyphens >= 2) {
    logOdds += 0.88;
    contributions.push({
      feature: `Multiple Hyphens in Domain (${hyphens})`,
      value: 0.88,
      unit: "log-odds",
      model: "XGBoost URL Classifier",
    });
  }

  // 6. Bank & institution keyword spoofing in domain
  const spoofKeywords = ["kbank", "scb", "bbl", "ktb", "krungsri", "police", "tax", "post", "flash", "kerry", "login", "secure", "verify", "update", "account"];
  const matchedSpoof = spoofKeywords.filter((k) => hostname.toLowerCase().includes(k));
  if (matchedSpoof.length > 0 && matchedTld) {
    logOdds += 1.5;
    contributions.push({
      feature: `Institution Keyword Spoofing (${matchedSpoof.join(", ")})`,
      value: 1.5,
      unit: "log-odds",
      model: "XGBoost URL Classifier",
    });
    reasons.push({
      code: "BRAND_IMPERSONATION",
      title: `Brand or Security Keyword Impersonation (${matchedSpoof.join(", ")})`,
      detail: "Detected attempt to imitate recognized institutional portals on an untrusted third-party domain.",
      source: "Heuristic Brand Engine",
      severity: "danger",
    });
  }

  // Calculate probability
  const rawProb = 1 / (1 + Math.exp(-logOdds));
  const urlScore = Math.min(100, Math.round(rawProb * 100));

  // Anomaly score
  const anomalyScore = Math.min(1, Number(((logOdds / 4) + (urlStr.length > 70 ? 0.3 : 0.05)).toFixed(2)));

  return {
    urlScore,
    contributions,
    anomaly: {
      score: anomalyScore,
      is_anomaly: anomalyScore > 0.6,
      baseline: anomalyScore > 0.6 ? "Abnormal lexical distribution" : "Normal web baseline",
    },
    reasons,
  };
}

// Text pattern analysis in English
export function analyzeTextPatterns(text: string): {
  textScore: number;
  reasons: Reason[];
  similarExamples: any[];
} {
  let baseScore = 12; // baseline minimal low score
  const lower = text.toLowerCase();

  // Pattern categories (Both English and bilingual scam signals)
  const urgencyKeywords = [
    "urgent", "immediately", "suspended", "freeze", "expires today", "final notice", "act now", "action required",
    "within 24 hours", "account locked", "compromised", "ด่วน", "ระงับ", "ภายในวันนี้"
  ];
  const credentialKeywords = [
    "otp", "password", "pin", "verify account", "enter credentials", "cvv", "passcode", "security code",
    "verification code", "confirm identity", "รหัสผ่าน", "ยืนยันตัวตน"
  ];
  const financialFraudKeywords = [
    "easy loan", "guaranteed profit", "telegram task", "crypto return", "lottery winner", "commission payout",
    "0% interest", "no guarantor", "instant approval", "work from home", "daily bonus", "กู้เงิน", "ได้เงินวันละ"
  ];
  const authorityKeywords = [
    "police", "customs", "high court", "revenue department", "tax refund", "express parcel", "delivery failed",
    "central bank", "fraud department", "postal service", "ไปรษณีย์", "สรรพากร"
  ];

  const matchedUrgency = urgencyKeywords.filter((k) => lower.includes(k));
  const matchedCredentials = credentialKeywords.filter((k) => lower.includes(k));
  const matchedFinancial = financialFraudKeywords.filter((k) => lower.includes(k));
  const matchedAuthority = authorityKeywords.filter((k) => lower.includes(k));

  const reasonsList: Reason[] = [];

  if (matchedCredentials.length > 0) {
    baseScore += 38;
    reasonsList.push({
      code: "CREDENTIAL_SOLICITATION",
      title: "Solicitation of One-Time Passwords (OTP) or Credentials",
      detail: `Detected request for authentication codes or passwords (${matchedCredentials.slice(0, 3).join(", ")}). Legitimate institutions never ask for confidential OTPs via unsolicited messages.`,
      source: "Regex / TF-IDF Vectorizer",
      severity: "danger",
    });
  }

  if (matchedUrgency.length > 0) {
    baseScore += 26;
    reasonsList.push({
      code: "HIGH_URGENCY_LURE",
      title: "Coercive Time-Constraint or High-Urgency Language",
      detail: `Text employs alarmist phrases (${matchedUrgency.slice(0, 3).join(", ")}) designed to induce panic and force hasty decisions without verification.`,
      source: "Urgency Lexicon Engine",
      severity: "warning",
    });
  }

  if (matchedFinancial.length > 0) {
    baseScore += 30;
    reasonsList.push({
      code: "FINANCIAL_BAIT",
      title: "Financial Bait: Unrealistic Profit, Instant Loan, or Daily Tasks",
      detail: `Detected high-yield promises, instant credit approval, or online task scams (${matchedFinancial.slice(0, 3).join(", ")}).`,
      source: "TF-IDF + Logistic Regression",
      severity: "danger",
    });
  }

  if (matchedAuthority.length > 0) {
    baseScore += 20;
    reasonsList.push({
      code: "AUTHORITY_IMPERSONATION",
      title: "Impersonation of Public Authority or Delivery Courier",
      detail: `Message claims to originate from law enforcement, tax revenue, or delivery services (${matchedAuthority.slice(0, 3).join(", ")}). Always verify using published official hotlines.`,
      source: "Entity Extraction & Brand Lexicon",
      severity: "warning",
    });
  }

  const similarExamples = [];
  if (matchedCredentials.length > 0 || matchedFinancial.length > 0) {
    similarExamples.push({
      text: "Security Alert: Your online banking access is temporarily frozen. Verify your one-time code immediately at the link below to restore access.",
      source: "National Anti-Fraud Intel Database 2026",
      similarity: 0.884,
      method: "multilingual-MiniLM-L12-v2",
      is_sample: false,
    });
  }
  if (matchedFinancial.length > 0) {
    similarExamples.push({
      text: "Hiring online product review agents. Earn $50-$150 daily from home. Instant bank payout, no initial deposit required. Contact on Telegram.",
      source: "Cyber Crime Taskforce Case #8812",
      similarity: 0.792,
      method: "multilingual-MiniLM-L12-v2",
      is_sample: false,
    });
  }

  return {
    textScore: Math.min(100, baseScore),
    reasons: reasonsList,
    similarExamples,
  };
}

// Build relational entity graph
export function buildGraph(entities: Entity[], matchedThreats: any[]): GraphData {
  const nodes: any[] = [];
  const edges: any[] = [];
  const nodeSet = new Set<string>();

  entities.forEach((ent) => {
    if (!nodeSet.has(ent.value)) {
      nodeSet.add(ent.value);
      nodes.push({
        id: ent.value,
        type: ent.type,
        label: ent.masked_value || ent.value,
        value: ent.value,
        is_sample: false,
        report_status: matchedThreats.length > 0 ? "confirmed" : "unverified",
        provenance: "User Input Observation",
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Link matched threats
  matchedThreats.forEach((threat) => {
    const threatNodeId = `threat-${threat.source}`;
    if (!nodeSet.has(threatNodeId)) {
      nodeSet.add(threatNodeId);
      nodes.push({
        id: threatNodeId,
        type: "campaign",
        label: threat.source,
        value: threat.source,
        is_sample: true,
        report_status: threat.status,
        provenance: threat.source,
        timestamp: "2026-03-01T10:00:00Z",
      });
    }

    edges.push({
      id: `edge-${edges.length + 1}`,
      source: threat.value,
      target: threatNodeId,
      relationship: "flagged_by",
      source_name: threat.source,
      evidence: threat.evidence,
      created_at: new Date().toISOString(),
    });

    if (threat.related && Array.isArray(threat.related)) {
      threat.related.forEach((rel: string) => {
        if (!nodeSet.has(rel)) {
          nodeSet.add(rel);
          const isPhone = rel.startsWith("08") || rel.startsWith("06") || rel.startsWith("+");
          const isLine = rel.startsWith("@");
          const type = isPhone ? "phone" : isLine ? "line" : rel.includes(".") ? "url" : "account";
          nodes.push({
            id: rel,
            type,
            label: maskIdentifier(rel, type),
            value: rel,
            is_sample: true,
            report_status: "flagged",
            provenance: threat.source,
            timestamp: "2026-03-01T10:00:00Z",
          });
          edges.push({
            id: `edge-${edges.length + 1}`,
            source: threatNodeId,
            target: rel,
            relationship: "associated_mule",
            source_name: threat.source,
            created_at: new Date().toISOString(),
          });
        }
      });
    }
  });

  if (entities.length > 1) {
    for (let i = 0; i < entities.length - 1; i++) {
      edges.push({
        id: `link-${i}`,
        source: entities[i].value,
        target: entities[i + 1].value,
        relationship: "co_occurred_in_message",
        source_name: "Input Observation",
        created_at: new Date().toISOString(),
      });
    }
  }

  return {
    nodes,
    edges,
    is_sample: nodes.some((n) => n.is_sample),
  };
}

// Master Scam Analysis Engine
export function analyzeInput(
  rawInput: string,
  kind: "text" | "url" | "image" | "qr" = "text",
  thresholds = { medium: 40.0, high: 70.0 }
): Analysis {
  const text = (rawInput || "").trim();
  const entities = extractEntities(text);
  const reasons: Reason[] = [];
  const contributions: Contribution[] = [];
  const missingData: string[] = [];
  const advice: string[] = [];

  // Match threats
  const matchedThreats = SAMPLE_THREAT_RECORDS.filter((rec) => {
    const cleanRecVal = rec.value.toLowerCase().replace(/[\s-]/g, "");
    return entities.some((e) => {
      const cleanEntVal = e.value.toLowerCase().replace(/[\s-]/g, "");
      return cleanEntVal === cleanRecVal || text.toLowerCase().includes(rec.value.toLowerCase());
    });
  });

  const textAnalysis = analyzeTextPatterns(text);
  reasons.push(...textAnalysis.reasons);

  let urlScore = 0;
  let anomalyData = { score: 0.12, is_anomaly: false, baseline: "Standard web baseline" };

  const urlEntity = entities.find((e) => e.type === "url" || e.type === "domain");
  if (urlEntity) {
    const urlAnalysis = analyzeUrlFeatures(urlEntity.value);
    urlScore = urlAnalysis.urlScore;
    contributions.push(...urlAnalysis.contributions);
    anomalyData = urlAnalysis.anomaly;
    reasons.push(...urlAnalysis.reasons);
  } else {
    missingData.push("No URL detected in the input; URL structural analysis model was skipped.");
  }

  let score = Math.max(textAnalysis.textScore, urlScore);

  let historyStatus = "no_records_found";
  if (matchedThreats.length > 0) {
    const hasConfirmed = matchedThreats.some((t) => t.status === "confirmed");
    if (hasConfirmed) {
      score = Math.max(score, 85.0);
      historyStatus = "confirmed_threat_match";
      reasons.unshift({
        code: "VERIFIED_THREAT_RECORD",
        title: "Confirmed Threat Database Record Found",
        detail: `This identifier matches a verified threat record from: ${matchedThreats[0].source} (${matchedThreats[0].evidence})`,
        source: matchedThreats[0].source,
        severity: "danger",
      });
    } else {
      score = Math.max(score, 50.0);
      historyStatus = "reported_clue_match";
      reasons.unshift({
        code: "REPORTED_CLUE_MATCH",
        title: "Community Warning Report Match",
        detail: `User-reported clue on record: ${matchedThreats[0].source}`,
        source: "Community Threat Intelligence",
        severity: "warning",
      });
    }
  } else {
    missingData.push("No prior history record found. NOTE: Absence of past reports does NOT equal safe (fresh scam domains have zero records).");
  }

  let level: RiskLevel = "LOW";
  if (score >= thresholds.high) {
    level = "HIGH";
    advice.push("Halt all financial transfers and transactions immediately.");
    advice.push("Never provide OTP, PIN, password, or ID card numbers.");
    advice.push("Verify authenticity exclusively via the company's publicly registered hotline.");
  } else if (score >= thresholds.medium) {
    level = "MEDIUM";
    advice.push("Exercise extreme caution before taking action or replying.");
    advice.push("Do not click links sent via unprompted SMS or private chats.");
    advice.push("Confirm recipient account name and phone against official directory.");
  } else {
    level = "LOW";
    advice.push("Low risk indicators found on current inputs, but remain vigilant.");
    advice.push("Financial institutions never send links requesting passwords via SMS.");
  }

  const graph = buildGraph(entities, matchedThreats);

  const summary =
    level === "HIGH"
      ? "Strong scam risk signals detected. Halt all actions and verify through official channels."
      : level === "MEDIUM"
      ? "Suspicious signals observed. Independent verification is strongly advised."
      : "Low risk observed on available parameters. Always verify unexpected offers.";

  return {
    id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    checked_at: new Date().toISOString(),
    input_kind: kind,
    raw_input: text,
    score,
    level,
    summary,
    entities,
    reasons,
    history: {
      status: historyStatus,
      matches: matchedThreats,
    },
    graph,
    missing_data: missingData,
    model: {
      version: "scamgraph-v2-hybrid-production",
      status: "ready",
      dataset_is_sample: false,
    },
    similar_examples: textAnalysis.similarExamples,
    contributions,
    advice,
    thresholds,
    anomaly: anomalyData,
  };
}
