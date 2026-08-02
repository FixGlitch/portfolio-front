"use client"

import { Icon } from "./icons"
import type { ContentType, View } from "./types"

export function Dashboard({
  contentTypes,
  onNavigate,
}: {
  contentTypes: ContentType[];
  onNavigate: (v: View) => void;
}) {
  const totalEntries = contentTypes.reduce((acc, ct) => acc + (ct._count?.entries || 0), 0);

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Overview of your content.</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Content Types</p>
          <p className="text-3xl font-bold text-gray-900">{contentTypes.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Entries</p>
          <p className="text-3xl font-bold text-gray-900">{totalEntries}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Locales</p>
          <p className="text-3xl font-bold text-gray-900">2</p>
          <p className="text-xs text-gray-400 mt-0.5">EN, ES</p>
        </div>
      </div>

      {/* Content Type List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Content Types</p>
        </div>
        {contentTypes.map((ct, i) => (
          <button
            key={ct.uid}
            onClick={() =>
              ct.kind === "singleType"
                ? onNavigate({ type: "singleType", ct })
                : onNavigate({ type: "collectionList", ct })
            }
            className={`w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50 transition ${
              i > 0 ? "border-t border-gray-100" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`p-1.5 rounded-lg ${ct.kind === "singleType" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                {ct.kind === "singleType" ? <Icon.Circle /> : <Icon.File />}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{ct.displayName}</p>
                <p className="text-[11px] text-gray-400 font-mono">{ct.uid}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                ct.kind === "singleType"
                  ? "bg-purple-100 text-purple-600"
                  : "bg-blue-100 text-blue-600"
              }`}>
                {ct.kind === "singleType" ? "Single" : "Collection"}
              </span>
              <span className="text-xs text-gray-400">{ct._count?.entries ?? 0} entries</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
