"use client"

import type { ReactNode } from "react"
import { Icon } from "./icons"
import type { View } from "./types"

export function TopBar({
  view,
  onBack,
  children,
}: {
  view: View;
  onBack?: () => void;
  children?: ReactNode;
}) {
  const crumbs: string[] = ["Content Manager"];
  if (view.type === "singleType") crumbs.push(view.ct.displayName);
  if (view.type === "collectionList") crumbs.push(view.ct.displayName);
  if (view.type === "collectionEdit") {
    crumbs.push(view.ct.displayName);
    crumbs.push(view.entry?.id ? "Edit" : "Create");
  }
  if (view.type === "media") crumbs.push("Media Library");
  if (view.type === "builder") crumbs.push(view.ct ? `Edit: ${view.ct.displayName}` : "New Content Type");
  if (view.type === "settings") crumbs.push("Settings");
  if (view.type === "home") crumbs.push("Dashboard");

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <Icon.ArrowLeft />
            </button>
          )}
          <nav className="flex items-center gap-1.5 text-[13px]">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <Icon.ChevronRight />}
                <span
                  className={
                    i === crumbs.length - 1
                      ? "font-semibold text-gray-900"
                      : "text-gray-400"
                  }
                >
                  {c}
                </span>
              </span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">{children}</div>
      </div>
    </header>
  );
}
