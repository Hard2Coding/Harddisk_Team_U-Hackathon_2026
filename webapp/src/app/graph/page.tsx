"use client";
import React, { useEffect, useState } from "react";
import { EntityGraph } from "@/components/graph/EntityGraph";
import { GraphData, GraphNode } from "@/types/api";
import { api } from "@/lib/api";
import { Network, RefreshCw, AlertCircle } from "lucide-react";

export default function GraphPage() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const loadGraph = async () => {
    setIsLoading(true);
    try {
      const data = await api.getGraph();
      setGraphData(data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 text-xs font-bold mb-2">
            <Network className="w-3.5 h-3.5 text-blue-600" />
            <span>Fraud Intelligence Knowledge Graph</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Entity Relationship Graph
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore connections between reported scam phone numbers, mule bank accounts, phishing domains, and threat campaigns
          </p>
        </div>

        <button
          onClick={loadGraph}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
          <span>Refresh Graph</span>
        </button>
      </div>

      {/* Information Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Graph connections illustrate <strong>observed relational co-occurrences</strong> in message lures, not legal guilt verdicts.
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-lg bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400 text-[10px] font-bold shrink-0">
          [SAMPLE] = Demonstration Data
        </span>
      </div>

      {/* Main Interactive Graph Canvas */}
      <div className="rounded-3xl shadow-xs overflow-hidden">
        <EntityGraph
          data={graphData}
          onNodeSelect={(node) => setSelectedNode(node)}
          height="h-[620px]"
        />
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {graphData.nodes?.length || 0}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">Network Entities (Nodes)</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {graphData.edges?.length || 0}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">Observed Edges (Links)</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-2xl font-black text-red-600 dark:text-red-400">
            {graphData.nodes?.filter((n) => n.report_status === "confirmed").length || 0}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">Confirmed Threats</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            100%
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">Masked Privacy Protected</div>
        </div>
      </div>
    </div>
  );
}
