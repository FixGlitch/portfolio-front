"use client"

import { Icon } from "./icons"
import type { ContentType, View } from "./types"

export function Sidebar({
  contentTypes,
  view,
  onNavigate,
  locale,
  onLocaleChange,
}: {
  contentTypes: ContentType[];
  view: View;
  onNavigate: (v: View) => void;
  locale: string;
  onLocaleChange: (l: "en" | "es") => void;
}) {
  const singleTypes = contentTypes.filter((ct) => ct.kind === "singleType");
  const collectionTypes = contentTypes.filter((ct) => ct.kind === "collectionType");

  const isActive = (ct: ContentType) =>
    (view.type === "singleType" && view.ct.uid === ct.uid) ||
    (view.type === "collectionList" && view.ct.uid === ct.uid) ||
    (view.type === "collectionEdit" && view.ct.uid === ct.uid);

  return (
    <aside className="w-[240px] shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4945ff] flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">CM</span>
          </div>
          <div>
            <h2 className="text-[13px] font-bold text-gray-900 leading-tight">Content Manager</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Portfolio</p>
          </div>
        </div>
      </div>

      {/* Locale Toggle */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {(["en", "es"] as const).map((loc) => (
            <button
              key={loc}
              onClick={() => onLocaleChange(loc)}
              className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition ${
                locale === loc
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {loc === "en" ? "English" : "Español"}
            </button>
          ))}
        </div>
      </div>

      {/* Home */}
      <div className="px-3 pt-3">
        <button
          onClick={() => onNavigate({ type: "home" })}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition ${
            view.type === "home"
              ? "bg-blue-50 text-[#4945ff] font-semibold"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Icon.Home />
          Dashboard
        </button>
      </div>

      {/* Collection Types */}
      <div className="px-3 pt-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1.5">
          Collection Types
        </p>
        {collectionTypes.map((ct) => (
          <button
            key={ct.uid}
            onClick={() => onNavigate({ type: "collectionList", ct })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition ${
              isActive(ct)
                ? "bg-blue-50 text-[#4945ff] font-semibold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <Icon.File />
              {ct.displayName}
            </span>
            <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">
              {ct._count?.entries ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Single Types */}
      <div className="px-3 pt-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1.5">
          Single Types
        </p>
        {singleTypes.map((ct) => (
          <button
            key={ct.uid}
            onClick={() => onNavigate({ type: "singleType", ct })}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition ${
              isActive(ct)
                ? "bg-blue-50 text-[#4945ff] font-semibold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Icon.Circle />
            {ct.displayName}
          </button>
        ))}
      </div>

      {/* Bottom */}
      <div className="mt-auto border-t border-gray-200 px-3 py-3 space-y-0.5">
        <button
          onClick={() => onNavigate({ type: "media" })}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition ${
            view.type === "media"
              ? "bg-blue-50 text-[#4945ff] font-semibold"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Icon.Image />
          Media Library
        </button>
        <button
          onClick={() => onNavigate({ type: "builder" })}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition ${
            view.type === "builder"
              ? "bg-blue-50 text-[#4945ff] font-semibold"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Icon.Blocks />
          Content-Type Builder
        </button>
        <button
          onClick={() => onNavigate({ type: "settings" })}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition ${
            view.type === "settings"
              ? "bg-blue-50 text-[#4945ff] font-semibold"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Icon.Settings />
          Settings
        </button>
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-gray-500 hover:bg-gray-50 transition"
        >
          <Icon.ExternalLink />
          View Site
        </a>
      </div>
    </aside>
  );
}
