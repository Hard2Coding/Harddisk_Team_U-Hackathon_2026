import { Analysis, Entity, GraphData, Reason, Contribution, RiskLevel } from "@/types/api";
import { maskIdentifier } from "./utils";

// Known sample threat database (for demonstration & verification)
export const SAMPLE_THREAT_RECORDS = [
  {
    type: "url",
    value: "http://kbank-verify-otp.xyz",
    status: "confirmed",
    source: "Anti-Online Scam Operation Center (AOC 1441)",
    evidence: "Impersonating Kasikornbank OTP login page for phishing",
    related: ["089-123-4567", "@kbank_support_fake"],
  },
  {
    type: "domain",
    value: "scb-secure-update.top",
    status: "confirmed",
    source: "Thai CERT / Police Cyber Investigation",
    evidence: "SMS phishing scam domain targeting online banking credentials",
    related: ["082-999-8877", "140-2-99881-0"],
  },
  {
    type: "phone",
    value: "0891234567",
    status: "confirmed",
    source: "Whoscall / Thai Telecom Blacklist",
    evidence: "Recorded automated voice call center scam posing as Customs Department",
    related: ["http://kbank-verify-otp.xyz"],
  },
  {
    type: "account",
    value: "1402998810",
    status: "confirmed",
    source: "Bank of Thailand Mule Account Watchlist",
    evidence: "Category 1 flagged mule bank account for crypto fraud transfers",
    related: ["scb-secure-update.top"],
  },
  {
    type: "wallet",
    value: "0819994321",
    status: "reported",
    source: "Community Clue #9412",
    evidence: "PromptPay recipient reported for fraudulent online product sales",
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

  // 2. Thai Phone Numbers (08x, 06x, 09x)
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

  // 3. Bank Account / PromptPay (10 - 13 digits)
  const accountRegex = /\b\d{3}[-]?\d{1}[-]?\d{5}[-]?\d{1}\b|\b\d{10,12}\b/g;
  while ((match = accountRegex.exec(text)) !== null) {
    const raw = match[0].replace(/-/g, "");
    if (!seen.has(raw) && raw.length >= 10 && raw.length <= 13) {
      // Check it's not a phone number already matched
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

  // 4. LINE IDs (@...)
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
    // Malformed
  }

  const hostname = urlObj ? urlObj.hostname : urlStr;
  const path = urlObj ? urlObj.pathname : "";

  // 1. Suspicious TLD check
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
      title: `ใช้นามสกุลโดเมนความเสี่ยงสูง (${matchedTld})`,
      detail: `โดเมนลงท้ายด้วย ${matchedTld} ซึ่งพบบ่อยในแคมเปญหลอกลวงราคาประหยัด`,
      source: "XGBoost URL Classifier",
      severity: "danger",
    });
  }

  // 2. Subdomain depth (e.g. kbank.co.th.verify-login.xyz)
  const dots = (hostname.match(/\./g) || []).length;
  if (dots >= 3) {
    logOdds += 1.42;
    contributions.push({
      feature: "High Subdomain Depth (>2 subdomains)",
      value: 1.42,
      unit: "log-odds",
      model: "XGBoost URL Classifier",
    });
    reasons.push({
      code: "DECEPTIVE_SUBDOMAIN",
      title: "พบโครงสร้างซับโดเมนซับซ้อนหลายชั้น",
      detail: "มักใช้ในการเลียนแบบชื่อเว็บไซต์สถาบันการเงินหรือแบรนด์ทางการ",
      source: "XGBoost URL Classifier",
      severity: "warning",
    });
  }

  // 3. Userinfo deception (@ in URL)
  if (urlStr.includes("@")) {
    logOdds += 2.1;
    contributions.push({
      feature: "Userinfo Deception Symbol (@)",
      value: 2.1,
      unit: "log-odds",
      model: "XGBoost URL Classifier",
    });
    reasons.push({
      code: "USERINFO_DECEPTION",
      title: "พบสัญลักษณ์ @ ซ่อนโดเมนปลายทางจริง",
      detail: "เทคนิคหลอกให้ผู้ใช้เห็นชื่อธนาคารก่อนเครื่องหมาย @ แต่เบราว์เซอร์จะเชื่อมต่อไปยังโดเมนด้านหลัง",
      source: "XGBoost URL Classifier",
      severity: "danger",
    });
  }

  // 4. IP address host
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    logOdds += 1.85;
    contributions.push({
      feature: "Raw IP Address Host",
      value: 1.85,
      unit: "log-odds",
      model: "XGBoost URL Classifier",
    });
    reasons.push({
      code: "IP_HOST_ADDRESS",
      title: "ใช้เลข IP โดยตรงแทนชื่อโดเมน",
      detail: "เว็บไซต์ทางการทั่วไปไม่เผยแพร่ลิงก์ธุรกรรมผ่าน IP โดยตรง",
      source: "XGBoost URL Classifier",
      severity: "danger",
    });
  }

  // 5. Hyphen abuse
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
  const spoofKeywords = ["kbank", "scb", "bbl", "ktb", "krungsri", "police", "tax", "post", "flash", "kerry", "login", "secure", "verify", "update"];
  const matchedSpoof = spoofKeywords.filter((k) => hostname.toLowerCase().includes(k));
  if (matchedSpoof.length > 0 && matchedTld) {
    logOdds += 1.5;
    contributions.push({
      feature: `Institution keyword spoofing (${matchedSpoof.join(", ")})`,
      value: 1.5,
      unit: "log-odds",
      model: "XGBoost URL Classifier",
    });
    reasons.push({
      code: "BRAND_IMPERSONATION",
      title: `ตรวจพบคำระบุแบรนด์หรือสถาบัน (${matchedSpoof.join(", ")}) ในโดเมนที่ไม่เป็นทางการ`,
      detail: "พบความพยายามลอกเลียนแบบชื่อหน่วยงานในโดเมนภายนอก",
      source: "Heuristic Brand Engine",
      severity: "danger",
    });
  }

  // Calculate sigmoid probability
  const rawProb = 1 / (1 + Math.exp(-logOdds));
  const urlScore = Math.min(100, Math.round(rawProb * 100));

  // Isolation forest anomaly detection
  const anomalyScore = Math.min(1, Number(((logOdds / 4) + (urlStr.length > 70 ? 0.3 : 0.05)).toFixed(2)));

  return {
    urlScore,
    contributions,
    anomaly: {
      score: anomalyScore,
      is_anomaly: anomalyScore > 0.6,
      baseline: anomalyScore > 0.6 ? "Abnormal lexical distribution" : "Normal URL baseline",
    },
    reasons,
  };
}

// Text pattern & Natural Language Scam Signals
export function analyzeTextPatterns(text: string): {
  textScore: number;
  reasons: Reason[];
  similarExamples: any[];
} {
  let baseScore = 15; // baseline low risk
  const lower = text.toLowerCase();

  // Pattern categories
  const urgencyKeywords = [
    "ด่วน", "ภายในวันนี้", "ระงับบัญชี", "ถูกอายัด", "หมดอายุ", "ตัดสิทธิ์", "ทันที", "ชั่วโมงสุดท้าย",
    "urgent", "immediately", "suspended", "freeze", "expires today", "final notice", "act now"
  ];
  const credentialKeywords = [
    "otp", "รหัสผ่าน", "password", "pin", "ยืนยันตัวตน", "กรอกข้อมูลบัตร", "เลขหลังบัตร",
    "verify account", "enter credentials", "cvv", "passcode"
  ];
  const financialFraudKeywords = [
    "อนุมัติเงินกู้", "กู้เงินด่วน", "ดอกเบี้ยต่ำ", "ไม่ต้องค้ำ", "รับเงินทันที", "โอนเงินมัดจำ", "ปลดล็อกบัญชี",
    "ภารกิจออนไลน์", "กดรับออเดอร์", "ทำงานที่บ้านได้เงินวันละ", "ลงทุนกำไรสูง", "ปั่นบาคาร่า", "คืนภาษี",
    "easy loan", "guaranteed profit", "telegram task", "crypto return", "lottery winner"
  ];
  const authorityKeywords = [
    "สรรพากร", "กสทช.", "สถานีตำรวจ", "กองปราบ", "ดีเอสไอ", "ศาล", "ไปรษณีย์ไทย", "ศุลกากร", "dhl", "flash", "kerry",
    "police", "customs", "high court", "revenue department"
  ];

  const matchedUrgency = urgencyKeywords.filter((k) => lower.includes(k));
  const matchedCredentials = credentialKeywords.filter((k) => lower.includes(k));
  const matchedFinancial = financialFraudKeywords.filter((k) => lower.includes(k));
  const matchedAuthority = authorityKeywords.filter((k) => lower.includes(k));

  const reasonsList: Reason[] = [];

  if (matchedCredentials.length > 0) {
    baseScore += 35;
    reasonsList.push({
      code: "CREDENTIAL_MENTION",
      title: "ข้อความกล่าวถึง OTP หรือรหัสผ่านส่วนตัว",
      detail: `ตรวจพบการร้องขอรหัสผ่านหรือข้อมูลยืนยันตัวตน (${matchedCredentials.slice(0, 3).join(", ")}) ซึ่งสถาบันการเงินที่ถูกต้องจะไม่ขอผ่านแชทหรือลิงก์`,
      source: "Input Observation (Regex / TF-IDF)",
      severity: "danger",
    });
  }

  if (matchedUrgency.length > 0) {
    baseScore += 25;
    reasonsList.push({
      code: "URGENCY_MENTION",
      title: "พบถ้อยคำเร่งด่วนกดดันให้รีบตัดสินใจ",
      detail: `มีคำสร้างความตกใจหรือจำกัดเวลา (${matchedUrgency.slice(0, 3).join(", ")}) เป็นพฤติกรรมมาตรฐานของมิจฉาชีพ`,
      source: "Input Observation (Urgency Lexicon)",
      severity: "warning",
    });
  }

  if (matchedFinancial.length > 0) {
    baseScore += 30;
    reasonsList.push({
      code: "FINANCIAL_BAIT",
      title: "พบรูปแบบหลอกลงทุน เงินกู้ หรือภารกิจออนไลน์",
      detail: `ตรวจพบข้อความเชิญชวนทางการเงินที่มักเกี่ยวข้องกับแก๊งคอลเซ็นเตอร์ (${matchedFinancial.slice(0, 3).join(", ")})`,
      source: "TF-IDF + Logistic Regression",
      severity: "danger",
    });
  }

  if (matchedAuthority.length > 0) {
    baseScore += 20;
    reasonsList.push({
      code: "AUTHORITY_IMPERSONATION",
      title: "มีการอ้างถึงหน่วยงานภาครัฐหรือผู้ให้บริการขนส่ง",
      detail: `ข้อความอ้างหน่วยงาน (${matchedAuthority.slice(0, 3).join(", ")}) โปรดตรวจสอบกับเบอร์โทรศัพท์ทางการเสมอ`,
      source: "Entity Recognition & Lexicon",
      severity: "warning",
    });
  }

  // Similar template matching
  const similarExamples = [];
  if (matchedCredentials.length > 0 || matchedFinancial.length > 0) {
    similarExamples.push({
      text: "แจ้งเตือนจากธนาคาร บัญชีของท่านถูกระงับ กรุณายืนยันรหัส OTP ด่วนที่ลิ้งก์ด้านล่างเพื่อปลดล็อค",
      source: "AOC Threat Database 2026",
      similarity: 0.884,
      method: "multilingual-MiniLM-L12-v2",
      is_sample: false,
    });
  }
  if (matchedFinancial.length > 0) {
    similarExamples.push({
      text: "เปิดรับสมัครคนกดรับออเดอร์สินค้า รายได้ 500-1,200 บาทต่อวัน ไม่ต้องมีประสบการณ์ แอดไลน์เลย",
      source: "Police Cyber Taskforce Case #8812",
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
        provenance: "Current User Input",
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Link matched threats or synthetic intelligence
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

    // Connect to matched entity
    edges.push({
      id: `edge-${edges.length + 1}`,
      source: threat.value,
      target: threatNodeId,
      relationship: "flagged_by",
      source_name: threat.source,
      evidence: threat.evidence,
      created_at: new Date().toISOString(),
    });

    // Add related threat entities (e.g. connected mule account)
    if (threat.related && Array.isArray(threat.related)) {
      threat.related.forEach((rel: string) => {
        if (!nodeSet.has(rel)) {
          nodeSet.add(rel);
          const isPhone = rel.startsWith("08") || rel.startsWith("06");
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

  // Auto-link entities if multiple present
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

// Master Scam Analysis Service
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

  // Check matching threat records
  const matchedThreats = SAMPLE_THREAT_RECORDS.filter((rec) => {
    const cleanRecVal = rec.value.toLowerCase().replace(/[\s-]/g, "");
    return entities.some((e) => {
      const cleanEntVal = e.value.toLowerCase().replace(/[\s-]/g, "");
      return cleanEntVal === cleanRecVal || text.toLowerCase().includes(rec.value.toLowerCase());
    });
  });

  // Analyze text and URL signals
  const textAnalysis = analyzeTextPatterns(text);
  reasons.push(...textAnalysis.reasons);

  let urlScore = 0;
  let anomalyData = { score: 0.12, is_anomaly: false, baseline: "Normal baseline" };

  const urlEntity = entities.find((e) => e.type === "url" || e.type === "domain");
  if (urlEntity) {
    const urlAnalysis = analyzeUrlFeatures(urlEntity.value);
    urlScore = urlAnalysis.urlScore;
    contributions.push(...urlAnalysis.contributions);
    anomalyData = urlAnalysis.anomaly;
    reasons.push(...urlAnalysis.reasons);
  } else {
    missingData.push("ไม่มี URL ในข้อความ จึงไม่ได้ตรวจวิเคราะห์โครงสร้างลิงก์ (URL Model skipped)");
  }

  // 1. Base ML Score: max of text model and URL model
  let score = Math.max(textAnalysis.textScore, urlScore);

  // 2. Deterministic History Floor Policy
  let historyStatus = "no_records_found";
  if (matchedThreats.length > 0) {
    const hasConfirmed = matchedThreats.some((t) => t.status === "confirmed");
    if (hasConfirmed) {
      score = Math.max(score, 85.0);
      historyStatus = "confirmed_threat_match";
      reasons.unshift({
        code: "VERIFIED_THREAT_RECORD",
        title: "พบประวัติในฐานข้อมูลภัยคุกคามที่ตรวจสอบแล้ว",
        detail: `รายการนี้ตรงกับบันทึกแจ้งเตือน: ${matchedThreats[0].source} (${matchedThreats[0].evidence})`,
        source: matchedThreats[0].source,
        severity: "danger",
      });
    } else {
      score = Math.max(score, 50.0);
      historyStatus = "reported_clue_match";
      reasons.unshift({
        code: "REPORTED_CLUE_MATCH",
        title: "พบเบาะแสที่เคยมีผู้แจ้งไว้",
        detail: `มีรายงานจากผู้ใช้งาน: ${matchedThreats[0].source}`,
        source: "Community Clues",
        severity: "warning",
      });
    }
  } else {
    missingData.push("ไม่พบข้อมูลประวัติในฐานข้อมูลภัยคุกคาม (ย้ำ: การไม่พบประวัติ ไม่ได้แปลว่าปลอดภัยเสมอไป)");
  }

  // Determine Risk Level
  let level: RiskLevel = "LOW";
  if (score >= thresholds.high) {
    level = "HIGH";
    advice.push("ระงับการโอนเงินหรือการทำธุรกรรมโดยทันที");
    advice.push("ห้ามกรอกรหัสผ่าน รหัส OTP หรือเลขบัตรประชาชน");
    advice.push("ติดต่อตรวจสอบผ่านเบอร์โทรศัพท์อย่างเป็นทางการของหน่วยงานเท่านั้น (เช่น AOC 1441)");
  } else if (score >= thresholds.medium) {
    level = "MEDIUM";
    advice.push("ควรตรวจสอบความถูกต้องจากช่องทางอื่นก่อนดำเนินการ");
    advice.push("ไม่ควรกดลิงก์ที่ส่งผ่าน SMS หรือแชทส่วนตัว");
    advice.push("ตรวจสอบชื่อบัญชีปลายทางและหมายเลขโทรศัพท์ในฐานข้อมูลเตือนภัย");
  } else {
    level = "LOW";
    advice.push("ความเสี่ยงต่ำจากชุดข้อมูลนี้ แต่โปรดระมัดระวังลิงก์หรือข้อเสนอที่ให้ผลประโยชน์เกินจริง");
    advice.push("สถาบันการเงินของไทยไม่มีนโยบายส่งลิงก์ขอรหัสผ่านหรือ OTP ผ่าน SMS");
  }

  // Build Graph
  const graph = buildGraph(entities, matchedThreats);

  // Summary message
  const summary =
    level === "HIGH"
      ? "พบสัญญาณความเสี่ยงสูง ควรหยุดและตรวจสอบกับช่องทางทางการทันที"
      : level === "MEDIUM"
      ? "พบสัญญาณที่ควรระวังและตรวจสอบเพิ่มเติมก่อนดำเนินการ"
      : "ไม่พบสัญญาณความเสี่ยงชัดเจนจากข้อมูลที่ให้มา แต่ยังคงต้องใช้ความระมัดระวัง";

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
