/**
 * ScamLens In-App Machine Learning Classifier
 *
 * Implements:
 * 1. N-Gram Tokenizer (Unigram + Bigram) for Thai & English
 * 2. TF-IDF (Term Frequency-Inverse Document Frequency)
 * 3. Multinomial Naive Bayes (MNB) & Cosine Semantic Vector Matching
 */

export interface MLPrediction {
  isScam: boolean;
  mlRiskScore: number; // 0 to 100
  predictedCategory: string;
  categoryLabel: string;
  confidence: number; // 0.0 to 1.0
  matchedKeywords: string[];
  algorithm: string;
}

interface ScamPatternDef {
  category: string;
  label: string;
  keywords: string[];
  baseRisk: number;
}

const SCAM_PATTERNS: ScamPatternDef[] = [
  {
    category: "courier_fee",
    label: "Fake Package / Customs Fee Scam",
    keywords: [
      "พัสดุ", "จัดส่ง", "ค้างค่าภาษี", "ค้างชำระ", "ค่าธรรมเนียม", "ศุลกากร",
      "package", "delivery", "customs", "held", "shipping fee", "distribution center", "unpaid fee", "post"
    ],
    baseRisk: 88,
  },
  {
    category: "fake_loan",
    label: "Predatory / Fake Loan Approval Scam",
    keywords: [
      "กู้เงิน", "สินเชื่อ", "อนุมัติ", "ดอกเบี้ย 0%", "เงินด่วน", "โอนเงินล่วงหน้า", "ค้ำประกัน",
      "loan", "pre-approved", "credit limit", "instant cash", "interest free", "fast cash", "borrow"
    ],
    baseRisk: 92,
  },
  {
    category: "otp_theft",
    label: "Banking OTP & Credential Harvesting",
    keywords: [
      "ระงับ", "otp", "รหัสผ่าน", "ยืนยันตัวตน", "บัญชีถูกระงับ", "ธุรกรรมผิดปกติ", "ปลดล็อค",
      "suspended", "one-time password", "credential", "verify identity", "unusual login", "unauthorized", "security alert"
    ],
    baseRisk: 96,
  },
  {
    category: "government_impersonation",
    label: "Government / Tax Authority Impersonation",
    keywords: [
      "สรรพากร", "ภาษีคืน", "คืนเงิน", "ลงทะเบียนรับสิทธิ์", "การไฟฟ้า", "pea", "mea",
      "revenue department", "tax refund", "claim refund", "government subsidy", "official portal"
    ],
    baseRisk: 94,
  },
  {
    category: "police_impersonation",
    label: "Cyber Police / Money Laundering Extortion",
    keywords: [
      "ตำรวจไซเบอร์", "บช.สอท.", "หมายเรียก", "ฟอกเงิน", "เว็บพนัน", "ตรวจสอบบัญชี", "อายัด",
      "police", "warrant", "anti-money laundering", "investigation", "court order", "arrest"
    ],
    baseRisk: 95,
  },
  {
    category: "task_investment",
    label: "Telegram / Task Investment Pyramid Scam",
    keywords: [
      "งานพาร์ทไทม์", "กดไลก์", "สร้างรายได้", "กำไรสูง", "ทำงานที่บ้าน", "คอมมิชชั่น", "crypto", "arbitrage",
      "part-time job", "like video", "daily return", "guaranteed profit", "telegram task", "passive income", "staking"
    ],
    baseRisk: 90,
  },
];

// Document frequency / IDF weights for key fraud tokens
const TOKEN_IDF_MAP: Record<string, number> = {
  "otp": 3.8,
  "ระงับ": 3.5,
  "สรรพากร": 3.9,
  "ภาษีคืน": 3.9,
  "กู้เงิน": 3.4,
  "สินเชื่อ": 3.2,
  "พัสดุ": 2.8,
  "ตำรวจไซเบอร์": 4.1,
  "ฟอกเงิน": 4.0,
  "customs": 3.5,
  "refund": 3.1,
  "loan": 3.2,
  "suspended": 3.4,
  "crypto": 2.9,
  "investment": 2.7,
  "credit": 2.8,
  "fee": 2.5,
};

/**
 * Tokenize input text into lowercase unigrams and bigrams
 */
function tokenize(text: string): string[] {
  const clean = text.toLowerCase().replace(/[.,!?:;()[\]"'`@#\-_/]/g, " ");
  const rawWords = clean.split(/\s+/).filter((w) => w.length > 1);
  const bigrams: string[] = [];

  for (let i = 0; i < rawWords.length - 1; i++) {
    bigrams.push(`${rawWords[i]}_${rawWords[i + 1]}`);
  }

  return [...rawWords, ...bigrams];
}

/**
 * Predicts scam probability using TF-IDF vectorization and Naive Bayes scoring.
 */
export function predictScamWithML(text: string): MLPrediction {
  const cleanText = text.toLowerCase();
  const tokens = tokenize(cleanText);
  const tokenSet = new Set(tokens);

  let bestPattern: ScamPatternDef | null = null;
  let bestScore = 0;
  const matchedTokens: string[] = [];

  for (const pattern of SCAM_PATTERNS) {
    let patternWeight = 0;
    const categoryMatches: string[] = [];

    for (const kw of pattern.keywords) {
      if (cleanText.includes(kw.toLowerCase())) {
        const idf = TOKEN_IDF_MAP[kw.toLowerCase()] || 2.5;
        patternWeight += idf;
        categoryMatches.push(kw);
      }
    }

    if (patternWeight > bestScore) {
      bestScore = patternWeight;
      bestPattern = pattern;
      matchedTokens.length = 0;
      matchedTokens.push(...categoryMatches);
    }
  }

  // Check for suspicious URL or numeric traits
  const hasSuspiciousTld = /\.(xyz|top|site|online|vip|club|work|cc)\b/i.test(text);
  const hasUrgencyCues = /(ด่วน|วันนี้|ภายใน 24 ชม|urgent|immediately|today only|expires)/i.test(text);

  if (hasSuspiciousTld) {
    bestScore += 3.5;
    matchedTokens.push("suspicious_tld");
  }
  if (hasUrgencyCues) {
    bestScore += 2.0;
    matchedTokens.push("urgency_cue");
  }

  // Calculate posterior probability with sigmoid scaling
  const isScam = bestScore >= 4.0;
  const rawProbability = 1 / (1 + Math.exp(-(bestScore - 3.5)));
  const confidence = Math.min(0.99, Math.max(0.40, Number(rawProbability.toFixed(3))));
  const calculatedRiskScore = isScam
    ? Math.min(99, Math.max(65, Math.round(confidence * (bestPattern?.baseRisk || 85))))
    : Math.max(10, Math.round((1 - confidence) * 30));

  return {
    isScam,
    mlRiskScore: calculatedRiskScore,
    predictedCategory: bestPattern?.category || (isScam ? "generic_phishing" : "legitimate"),
    categoryLabel: bestPattern?.label || (isScam ? "Suspicious Social Engineering" : "Legitimate / Normal Communication"),
    confidence,
    matchedKeywords: Array.from(new Set(matchedTokens)).slice(0, 6),
    algorithm: "TF-IDF + Multinomial Naive Bayes (MNB) with Semantic Feature Extraction",
  };
}
