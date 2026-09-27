"use client";

import { useState, useMemo, type HTMLAttributes } from "react";
import { cn } from "../../../utils/cn";

export interface OrgNode {
  id: string;
  parent_id: string | null;
  nik: string;
  name: string;
  title: string;
  department: string;
  job_level: string;
  email: string;
  avatar_url?: string;
  children?: OrgNode[];
}

export interface OrgChartTreeProps extends HTMLAttributes<HTMLDivElement> {
  nodes: OrgNode[];
  rootId?: string;
}

export function OrgChartTree({
  nodes,
  rootId = "EMP-ADM-001",
  className,
  ...props
}: OrgChartTreeProps) {
  const [search, setSearch] = useState("");
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  // Bangun struktur tree bersarang (Nested Tree Hierarchy) dari flat list
  const treeData = useMemo(() => {
    const rawNodes: any = nodes;
    const safeNodes: OrgNode[] = Array.isArray(rawNodes)
      ? rawNodes
      : Array.isArray(rawNodes?.nodes)
      ? rawNodes.nodes
      : [];

    const map: Record<string, OrgNode> = {};
    safeNodes.forEach((n) => {
      map[n.id] = { ...n, children: [] };
    });

    let root: OrgNode | null = null;
    safeNodes.forEach((n) => {
      const node = map[n.id];
      if (!node) return;

      if (!n.parent_id || n.id === rootId) {
        root = node;
      } else if (n.parent_id && map[n.parent_id]) {
        const parent = map[n.parent_id];
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(node);
        }
      } else if (root) {
        if (!root.children) root.children = [];
        root.children.push(node);
      }
    });

    return root;
  }, [nodes, rootId]);

  const toggleCollapse = (id: string) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderCard = (node: OrgNode, isRoot: boolean = false) => {
    const isMatchingSearch =
      search.trim() !== "" &&
      (node.name.toLowerCase().includes(search.toLowerCase()) ||
        node.title.toLowerCase().includes(search.toLowerCase()) ||
        node.department.toLowerCase().includes(search.toLowerCase()) ||
        node.nik.toLowerCase().includes(search.toLowerCase()));

    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isCollapsed = Boolean(collapsedNodes[node.id]);

    return (
      <div
        key={node.id}
        className={cn(
          "flex flex-col items-center transition-all duration-200",
          isMatchingSearch && "scale-105"
        )}
      >
        {/* Node Box */}
        <div
          className={cn(
            "w-64 p-3.5 rounded-md border backdrop-blur transition-all duration-150 shadow-lg relative",
            isRoot
              ? "bg-indigo-50/70 dark:bg-gradient-to-b dark:from-indigo-950/50 dark:to-slate-900 border-indigo-200 dark:border-indigo-500/50 hover:border-indigo-400 shadow-sm"
              : hasChildren
              ? "bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 shadow-sm"
              : "bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm",
            isMatchingSearch && "ring-2 ring-emerald-400 border-emerald-500"
          )}
        >
          {/* Header Card */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border",
                  isRoot
                    ? "bg-indigo-600 text-white border-indigo-400"
                    : hasChildren
                    ? "bg-slate-800 text-emerald-400 border-slate-700"
                    : "bg-slate-900 text-slate-300 border-slate-800"
                )}
              >
                {node.name.charAt(0)}
              </div>
              <div className="truncate">
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs block truncate">
                  {node.name}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {node.title}
                </span>
              </div>
            </div>

            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shrink-0">
              {node.job_level}
            </span>
          </div>

          {/* Footer Card */}
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="font-mono text-slate-500">{node.nik}</span>
            <span className="font-medium text-emerald-400/90">{node.department}</span>
          </div>

          {/* Expand / Collapse Button */}
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse(node.id);
              }}
              title={isCollapsed ? "Buka Bawahan" : "Lipat Bawahan"}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 hover:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 transition shadow-md z-10"
            >
              {isCollapsed ? `+${node.children?.length ?? 0}` : "−"}
            </button>
          )}
        </div>

        {/* Garis Konektor dan Cabang Anak (Subordinates) */}
        {hasChildren && !isCollapsed && (
          <div className="flex flex-col items-center w-full">
            <div className="w-0.5 h-6 bg-slate-700 my-0" />

            <div className="flex justify-center relative pt-4">
              {node.children && node.children.length > 1 && (
                <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-slate-700" />
              )}

              <div className="flex gap-4 sm:gap-6 items-start">
                {node.children?.map((child) => (
                  <div key={child.id} className="flex flex-col items-center relative">
                    <div className="w-0.5 h-4 bg-slate-700 -mt-4 mb-0" />
                    {renderCard(child)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Top Header & Search Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-md border border-slate-800 backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <h3 className="font-semibold text-slate-100 text-lg">
              Bagan Struktur Hirarki Organisasi (Org-Chart)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualisasi relasi pimpinan ke bawahan terstruktur dengan fungsi interaktif lipat / buka cabang.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari nama, jabatan, NIK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-sm pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500"
          />
          <span className="absolute left-2.5 top-2.5 text-xs text-slate-500">🔍</span>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tree Visualization Canvas */}
      <div className="w-full overflow-x-auto p-6 sm:p-10 rounded-md bg-slate-950/90 border border-slate-800 shadow-2xl min-h-[400px] flex justify-center scrollbar-thin">
        {!treeData ? (
          <div className="flex items-center justify-center text-slate-500 text-sm py-16">
            Tidak ada data struktur organisasi
          </div>
        ) : (
          renderCard(treeData, true)
        )}
      </div>
    </div>
  );
}
