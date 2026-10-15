# ScamGraph AI — Web Application

> **Tagline:** *"Predict Before It Gets Reported"* — An evidence-based Thai/English fraud and scam risk intelligence platform.

---

## 🌟 Overview & Key Features

ScamGraph AI is a pure web-native application built following `PROJECT_OVERVIEW.md`, `UI_UX_DESIGN.md`, `implement.md`, and `BACKEND_ARCHITECTURE.md`. Designed specifically for effortless 1-click **Vercel** deployment with zero complex C-library or native mobile dependencies.

### 🛡️ Core Capabilities:
1. **Multi-Modal Risk Scanner (`/analyze`):**
   - **Text Messages:** SMS, LINE messages, urgency detection, credential & OTP theft patterns.
   - **URL & Domain Structure:** Lexical and structural XGBoost heuristic feature analysis, suspicious TLD detection, subdomain depth, userinfo `@` deception, and raw IP address flags.
   - **Screenshot OCR:** In-memory client/serverless character extraction with an **editable review field** and automatic EXIF/GPS coordinate stripping.
   - **QR Code Scanning:** Decodes PromptPay QR and phishing deep links with safety verification.
   - **Batch CSV Analysis:** Analyze multiple entries in one workflow.
2. **Explainable AI & Grounding:**
   - **Evidence Grounding Factors:** Clear tags (`[CREDENTIAL_MENTION]`, `[URGENCY_MENTION]`, `[SUSPICIOUS_TLD]`, `[VERIFIED_THREAT_RECORD]`).
   - **Tree SHAP Values:** Log-odds impact meters explaining which URL features raised the risk score.
   - **Isolation Forest Anomaly Meter:** Structural irregularity score relative to standard web baselines.
   - **Deterministic Fusion Policy:** Enforces hard score floors for confirmed threats (85.0), reviewed clues (65.0), and reported mentions (50.0). Synthetic demo nodes display prominent `[SAMPLE]` badges and never inflate scores.
   - **"No History Found ≠ Safe":** Explicit alerts educating users that fresh scam domains have zero prior records.
3. **Interactive Relational Knowledge Graph (`/graph`):**
   - Interactive SVG node-link graph connecting phone numbers, bank accounts, websites, and scam campaigns.
   - Node Inspector Drawer with provenance, entity type, and relationship details.
4. **History & Safe Export (`/history`):**
   - Search & filter by Risk Level (`High`, `Medium`, `Low`) and Input Kind (`Text`, `URL`, `Image`, `QR`).
   - Export to JSON and CSV with formula injection sanitization (`=`, `+`, `-`, `@`).
5. **Community Clue Reporting (`/reports`):**
   - Live entity preview as the user types.
   - Submission tracking with status badges (`🟡 Pending Review`, `🟢 Confirmed`, `🔴 Rejected`).
6. **Support & Thai Emergency Hotlines (`/help`):**
   - Searchable FAQ accordion.
   - Emergency contacts: AOC 1441 (24/7 hotline), NBTC 1200, Thai Police Online (`thaipoliceonline.go.th`), and major Thai bank fraud reporting numbers.
7. **Admin Control Center (`/admin`):**
   - Metrics grid and risk distribution.
   - Report moderation queue with mandatory moderation reasons.
   - Dynamic threshold sliders (`score_medium`, `score_high`).
8. **Settings & GDPR / PDPA Privacy (`/settings`):**
   - LINE alert toggle for high-risk scans.
   - Download All My Data (JSON).
   - Right to Erasure account deletion.

---

## 🚀 How to Run Locally

```bash
# In the root repository
npm install --prefix webapp

# Start the Next.js development server
npm run dev

# Open in your browser:
# http://localhost:3000
```

---

## ☁️ How to Deploy to Vercel

### Method 1: Connect GitHub / GitLab Repository
1. Push this repository to GitHub or GitLab.
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your repository.
4. If asked for **Root Directory**, enter `webapp` (or leave default since root `package.json` and `vercel.json` are already pre-configured).
5. Click **Deploy**!

### Method 2: Deploy using Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🎨 Design System & Visual Assets
- **Logo:** AI-generated high-resolution cyber shield with interconnected neural graph nodes (`public/brand-logo.png`).
- **Dark & Light Modes:** Supported via design tokens (`--bg`, `--card`, `--ink`, `--muted`, `--brand-gradient`).
- **Typography:** Inter, Noto Sans Thai, system-ui.
