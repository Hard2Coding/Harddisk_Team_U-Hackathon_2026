export type RiskLevel = "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT DATA";

export interface Entity {
  id: string;
  type: "domain" | "url" | "phone" | "account" | "wallet" | "line" | "organization";
  value: string;
  masked_value?: string;
}

export interface GraphNode {
  id: string;
  label?: string;
  value?: string;
  type: string;
  is_sample?: boolean;
  report_status?: string;
  provenance?: string;
  timestamp?: string;
  risk_level?: RiskLevel;
}

export interface GraphEdge {
  id?: string;
  source: string;
  target: string;
  relationship?: string;
  source_name?: string;
  evidence?: string;
  created_at?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  is_sample?: boolean;
}

export interface Reason {
  code: string;
  title: string;
  detail: string;
  source: string;
  severity?: "danger" | "warning" | "info";
}

export interface Contribution {
  feature: string;
  value: number;
  unit: string;
  model: string;
}

export interface SimilarExample {
  text: string;
  source: string;
  similarity: number;
  method: string;
  is_sample: boolean;
}

export interface Analysis {
  id: string;
  checked_at: string;
  input_kind: "text" | "url" | "image" | "qr";
  raw_input?: string;
  score: number | null;
  level: RiskLevel;
  summary: string;
  entities: Entity[];
  reasons: Reason[];
  history: {
    status: string;
    matches: Record<string, unknown>[];
  };
  graph: GraphData;
  missing_data: string[];
  model: {
    version: string;
    status: string | Record<string, unknown>;
    dataset_is_sample: boolean;
  };
  similar_examples: SimilarExample[];
  contributions: Contribution[];
  advice: string[];
  thresholds: Record<string, number>;
  anomaly?: {
    score: number;
    is_anomaly: boolean;
    baseline: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
  created_at?: string;
}

export interface HistoryItem {
  id: string;
  user_id?: string;
  text: string;
  masked_text: string;
  kind: "text" | "url" | "image" | "qr";
  level: RiskLevel;
  score: number | null;
  created_at: string;
  result: Analysis;
}

export interface CommunityReport {
  id: string;
  user_id?: string;
  user_name?: string;
  kind: string;
  text: string;
  detail: string;
  entities: Entity[];
  evidence_files: string[];
  status: "pending" | "confirmed" | "rejected";
  moderation_reason?: string;
  created_at: string;
  reviewed_at?: string;
}

export interface AdminStats {
  total_analyses: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  pending_reports: number;
  total_users: number;
  system_health: string;
  thresholds: {
    medium: number;
    high: number;
  };
}
