"use client";
import React, { useState, useMemo, useRef } from "react";
import { GraphData, GraphNode, GraphEdge } from "@/types/api";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  ShieldAlert,
  Globe,
  Phone,
  CreditCard,
  MessageCircle,
  ExternalLink,
  X,
  Info,
} from "lucide-react";
import { maskIdentifier } from "@/lib/utils";

interface EntityGraphProps {
  data: GraphData;
  onNodeSelect?: (node: GraphNode | null) => void;
  height?: string;
}

export function EntityGraph({ data, onNodeSelect, height = "h-[540px]" }: EntityGraphProps) {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter nodes if user types in search
  const filteredNodes = useMemo(() => {
    if (!searchFilter.trim()) return data.nodes || [];
    const q = searchFilter.toLowerCase();
    return (data.nodes || []).filter(
      (n) =>
        (n.label && n.label.toLowerCase().includes(q)) ||
        (n.value && n.value.toLowerCase().includes(q)) ||
        n.type.toLowerCase().includes(q)
    );
  }, [data.nodes, searchFilter]);

  // Layout node positions in a dynamic circular/force arrangement
  const layoutNodes = useMemo(() => {
    const nodes = filteredNodes;
    const total = nodes.length;
    const centerX = 360;
    const centerY = 240;
    const radius = Math.min(220, Math.max(140, total * 30));

    return nodes.map((node, index) => {
      // Threat campaign in center if present, otherwise circle
      let x = centerX;
      let y = centerY;
      if (node.type === "campaign") {
        x = centerX;
        y = centerY;
      } else {
        const angle = (index / (total || 1)) * 2 * Math.PI;
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
      }
      return { ...node, x, y };
    });
  }, [filteredNodes]);

  // Node position lookup map
  const posMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    layoutNodes.forEach((n) => map.set(n.id, { x: n.x, y: n.y }));
    return map;
  }, [layoutNodes]);

  const getNodeColor = (type: string, status?: string) => {
    if (type === "campaign" || status === "confirmed") {
      return { bg: "#EF4444", border: "#B91C1C", text: "#FFFFFF", ring: "rgba(239, 68, 68, 0.3)" };
    }
    if (type === "phone") {
      return { bg: "#8B5CF6", border: "#6D28D9", text: "#FFFFFF", ring: "rgba(139, 92, 246, 0.3)" };
    }
    if (type === "account" || type === "wallet") {
      return { bg: "#F59E0B", border: "#D97706", text: "#FFFFFF", ring: "rgba(245, 158, 11, 0.3)" };
    }
    if (type === "line") {
      return { bg: "#10B981", border: "#059669", text: "#FFFFFF", ring: "rgba(16, 185, 129, 0.3)" };
    }
    // Default URL / domain
    return { bg: "#3B82F6", border: "#1D4ED8", text: "#FFFFFF", ring: "rgba(59, 130, 246, 0.3)" };
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    if (onNodeSelect) onNodeSelect(node);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${height} rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden shadow-inner flex flex-col`}
    >
      {/* Graph Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search entity..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden w-28 sm:w-36"
          />
          {searchFilter && (
            <button onClick={() => setSearchFilter("")} className="text-slate-400 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Legend pills & Zoom controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Domain</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Phone</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Account</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Threat</span>
          </div>

          <div className="flex items-center bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800 p-1 text-slate-300">
            <button
              onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
              className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Reset View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden">
        <svg
          className="w-full h-full select-none"
          viewBox="0 0 720 480"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 0.2s ease-out" }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
            {/* Animated Edge Marker */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#64748B" />
            </marker>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Edges */}
          {(data.edges || []).map((edge, idx) => {
            const sourcePos = posMap.get(edge.source);
            const targetPos = posMap.get(edge.target);
            if (!sourcePos || !targetPos) return null;

            const midX = (sourcePos.x + targetPos.x) / 2;
            const midY = (sourcePos.y + targetPos.y) / 2;

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke="#475569"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  markerEnd="url(#arrow)"
                />
                {edge.relationship && (
                  <text
                    x={midX}
                    y={midY - 6}
                    fill="#94A3B8"
                    fontSize="9"
                    textAnchor="middle"
                    className="select-none font-mono"
                  >
                    {edge.relationship}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {layoutNodes.map((node) => {
            const colors = getNodeColor(node.type, node.report_status);
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleNodeClick(node)}
                className="cursor-pointer group"
              >
                {/* Glow ring */}
                <circle
                  r={isSelected ? "34" : "28"}
                  fill={colors.ring}
                  className="transition-all duration-300 group-hover:scale-125"
                />
                {/* Main Node Circle */}
                <circle
                  r="24"
                  fill={colors.bg}
                  stroke={isSelected ? "#FFFFFF" : colors.border}
                  strokeWidth={isSelected ? "3" : "2"}
                  className="transition-all duration-200 group-hover:scale-110"
                />

                {/* Node Label Text */}
                <text
                  y="4"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="9"
                  fontWeight="bold"
                  className="select-none uppercase pointer-events-none"
                >
                  {node.type.slice(0, 5)}
                </text>

                {/* Value / Identifier Label Below */}
                <text
                  y="38"
                  textAnchor="middle"
                  fill="#E2E8F0"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="select-none pointer-events-none drop-shadow-md"
                >
                  {maskIdentifier(node.label || node.value || node.id, node.type)}
                </text>

                {/* [SAMPLE] Badge if synthetic */}
                {node.is_sample && (
                  <g transform="translate(10, -22)">
                    <rect width="36" height="13" rx="4" fill="#DC2626" />
                    <text x="18" y="9.5" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold">
                      SAMPLE
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Inspector Drawer */}
      {selectedNode && (
        <div className="absolute right-3 bottom-3 top-16 w-80 bg-slate-950/95 backdrop-blur-md rounded-2xl border border-slate-800 p-4 text-white text-xs space-y-3 z-20 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-400" />
              <span>รายละเอียดเอนทิตี</span>
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Entity Type</span>
              <div className="font-bold text-sm text-blue-400 capitalize">{selectedNode.type}</div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase">Masked Identifier</span>
              <div className="font-mono text-xs bg-slate-900 p-2 rounded-lg border border-slate-800 text-slate-200">
                {selectedNode.value || selectedNode.label || selectedNode.id}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Status</span>
                <div className="font-semibold text-xs text-amber-400 uppercase">
                  {selectedNode.report_status || "Observed"}
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Data Provenance</span>
                <div className="text-xs text-slate-300 truncate">
                  {selectedNode.provenance || "Input Extract"}
                </div>
              </div>
            </div>

            {selectedNode.is_sample && (
              <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-800/80 text-[11px] text-red-300">
                <span className="font-bold">[SAMPLE]:</span> ข้อมูลจำลองสำหรับสาธิตระบบ ไม่ส่งผลกระทบต่อคะแนนจริงของผู้ใช้
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
