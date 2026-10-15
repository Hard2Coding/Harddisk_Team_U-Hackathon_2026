import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    models: {
      text_classifier: "ready",
      url_xgboost: "ready",
      anomaly_isolation_forest: "ready",
      sentence_embeddings: "ready",
      knowledge_graph: "ready",
    },
    version: "scamgraph-v2-hybrid-production",
    zero_trust_policy: "active",
    timestamp: new Date().toISOString(),
  });
}
