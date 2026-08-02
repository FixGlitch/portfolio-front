"use client"

import { useState, useEffect } from "react"
import { TopBar } from "./top-bar"
import { Icon } from "./icons"
import type { ContentType, Entry, ToastMsg, View } from "./types"

export function CollectionList({
  ct,
  locale,
  onEdit,
  onNew,
  onNavigate,
  toast,
}: {
  ct: ContentType;
  locale: string;
  onEdit: (entry: Entry) => void;
  onNew: () => void;
  onNavigate: (v: View) => void;
  toast: (t: ToastMsg) => void;
}) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`/api/entries?contentType=${ct.uid}&locale=${locale}`)
      .then((r) => r.json())
      .then((e) => setEntries(Array.isArray(e) ? e : []));
  }, [ct.uid, locale]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    const res = await fetch(`/api/entries/delete?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast({ message: "Entry deleted", type: "success" });
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selected.size} entries?`)) return;
    for (const id of selected) {
      await fetch(`/api/entries/delete?id=${id}`, { method: "DELETE" });
    }
    setEntries((prev) => prev.filter((e) => !selected.has(e.id)));
    setSelected(new Set());
    toast({ message: `${selected.size} entries deleted`, type: "success" });
  }

  const titleField = ct.schema.find((f) => f.name === "title" || f.name === "heading");
  const descField = ct.schema.find((f) => f.type === "longText");

  const filtered = entries.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return Object.values(e.data).some((v) => v.toLowerCase().includes(q));
  });

  const allSelected = filtered.length > 0 && filtered.every((e) => selected.has(e.id));

  return (
    <>
      <TopBar view={{ type: "collectionList", ct }} onBack={() => onNavigate({ type: "home" })}>
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"><Icon.Search /></span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-8 pr-3 py-1.5 w-52 rounded-lg border border-gray-300 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4945ff] focus:border-transparent"
          />
        </div>
        {selected.size > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
          >
            Delete ({selected.size})
          </button>
        )}
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#4945ff] text-white rounded-lg text-sm font-semibold hover:bg-[#3b36d4] transition"
        >
          <Icon.Plus /> Create new
        </button>
      </TopBar>

      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[40px_1fr_1fr_100px_80px] gap-4 items-center px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <div>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => {
                  if (allSelected) {
                    setSelected(new Set());
                  } else {
                    setSelected(new Set(filtered.map((e) => e.id)));
                  }
                }}
                className="rounded border-gray-300 text-[#4945ff] focus:ring-[#4945ff]"
              />
            </div>
            <span>{titleField?.label || "Title"}</span>
            <span>{descField?.label || "Description"}</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                <Icon.File />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {search ? "No results found" : "No entries yet"}
              </p>
              <p className="text-xs text-gray-400 mb-4">
                {search ? "Try a different search" : "Create your first entry to get started."}
              </p>
              {!search && (
                <button
                  onClick={onNew}
                  className="px-4 py-2 bg-[#4945ff] text-white rounded-lg text-sm font-semibold hover:bg-[#3b36d4] transition"
                >
                  Create new entry
                </button>
              )}
            </div>
          ) : (
            <div>
              {filtered.map((entry) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-[40px_1fr_1fr_100px_80px] gap-4 items-center px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition group"
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={selected.has(entry.id)}
                      onChange={() => {
                        const next = new Set(selected);
                        if (next.has(entry.id)) next.delete(entry.id);
                        else next.add(entry.id);
                        setSelected(next);
                      }}
                      className="rounded border-gray-300 text-[#4945ff] focus:ring-[#4945ff]"
                    />
                  </div>
                  <button
                    onClick={() => onEdit(entry)}
                    className="text-left text-sm font-medium text-gray-900 hover:text-[#4945ff] transition truncate"
                  >
                    {titleField ? entry.data[titleField.name] || "—" : entry.id.slice(0, 8)}
                  </button>
                  <div className="text-sm text-gray-500 truncate">
                    {descField ? (entry.data[descField.name] || "—").slice(0, 60) : "—"}
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      entry.published
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${entry.published ? "bg-emerald-500" : "bg-gray-400"}`} />
                      {entry.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onEdit(entry)}
                      className="p-1.5 rounded-md text-gray-400 hover:text-[#4945ff] hover:bg-blue-50 transition"
                    >
                      <Icon.Edit />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    >
                      <Icon.Trash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 text-xs text-gray-400 text-right">
          {filtered.length} of {entries.length} entries
        </div>
      </div>
    </>
  );
}
