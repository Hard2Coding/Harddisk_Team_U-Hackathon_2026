"use client";
import React, { useEffect, useState } from "react";
import { EntityGraph } from "@/components/graph/EntityGraph";
import { GraphData, GraphNode } from "@/types/api";
import { api } from "@/lib/api";
import { Network, ShieldAlert, Sparkles, Filter, RefreshCw, AlertCircle } from "lucide-react";

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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
            <Network className="w-3.5 h-3.5" />
            <span>Fraud Intelligence Knowledge Graph</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            เครือข่ายความสัมพันธ์ภัยคุกคาม (Entity Relationship Graph)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            สำรวจการเชื่อมโยงระหว่างเบอร์โทรศัพท์มิจฉาชีพ บัญชีม้า โดเมนฟิชชิ่ง และแคมเปญหลอกลวงที่เคยตรวจพบ
          </p>
        </div>

        <button
          onClick={loadGraph}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-500" : ""}`} />
          <span>รีเฟรชเครือข่าย</span>
        </button>
      </div>

      {/* Information Banner */}
      <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            เส้นเชื่อมโยงในกราฟแสดง <strong>ความสัมพันธ์ที่ถูกสังเกตพบร่วมกันในข้อความ</strong> ไม่ได้ตัดสินความผิดทางกฎหมายอัตโนมัติ
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400 text-[10px] font-bold">
          [SAMPLE] = ข้อมูลจำลองสำหรับทดสอบ
        </span>
      </div>

      {/* Main Interactive Graph Canvas */}
      <div className="rounded-3xl shadow-sm">
        <EntityGraph
          data={graphData}
          onNodeSelect={(node) => setSelectedNode(node)}
          height="h-[620px]"
        />
      </div>

      {/* Graph Summary Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800">
          <div className="text-xl font-black text-blue-600 dark:text-blue-400">
            {graphData.nodes?.length || 0}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">เอนทิตีในเครือข่าย (Nodes)</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800">
          <div className="text-xl font-black text-purple-600 dark:text-purple-400">
            {graphData.edges?.length || 0}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">ความสัมพันธ์ที่เชื่อมโยง (Edges)</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800">
          <div className="text-xl font-black text-red-600 dark:text-red-400">
            {graphData.nodes?.filter((n) => n.report_status === "confirmed").length || 0}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">บันทึกภัยที่ยืนยันแล้ว</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800">
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            100%
          </div>
          <div className="text-xs text-slate-500 mt-0.5">ปกปิดข้อมูลส่วนบุคคล (Masked)</div>
        </div>
      </div>
    </div>
  );
}
