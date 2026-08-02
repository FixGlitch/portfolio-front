"use client"

import { useState, useEffect } from "react"
import { TopBar } from "./top-bar"
import { FieldEditor } from "./field-editor"
import { useMediaUpload } from "./use-media-upload"
import type { ContentType, Entry, ToastMsg, View } from "./types"

export function SingleTypeEditor({
  ct,
  locale,
  toast,
  onNavigate,
}: {
  ct: ContentType;
  locale: string;
  toast: (t: ToastMsg) => void;
  onNavigate: (v: View) => void;
}) {
  const [entry, setEntry] = useState<Entry | null>(null);
  const [data, setData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const uploadMedia = useMediaUpload(toast);

  useEffect(() => {
    fetch(`/api/entries?contentType=${ct.uid}&locale=${locale}`)
      .then((r) => r.json())
      .then((e) => {
        setEntry(e);
        setData(e?.data || {});
      });
  }, [ct.uid, locale]);

  function handleChange(key: string, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/entries/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentTypeUid: ct.uid, locale, data }),
    });
    setSaving(false);
    if (res.ok) {
      const updated = await res.json();
      setEntry(updated);
      setDirty(false);
      toast({ message: `${ct.displayName} saved`, type: "success" });
    } else {
      toast({ message: "Failed to save", type: "error" });
    }
  }

  return (
    <>
      <TopBar view={{ type: "singleType", ct }} onBack={() => onNavigate({ type: "home" })}>
        {dirty && (
          <span className="text-xs text-amber-600 font-semibold mr-2">Unsaved changes</span>
        )}
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="px-4 py-2 bg-[#4945ff] text-white rounded-lg text-sm font-semibold hover:bg-[#3b36d4] transition disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </TopBar>
      <div className="flex">
        {/* Main form */}
        <div className="flex-1 p-6 max-w-3xl">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
            {ct.schema.map((field) => (
              <div key={field.name}>
                <label className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <FieldEditor
                  field={field}
                  value={data[field.name] || ""}
                  onChange={(v) => handleChange(field.name, v)}
                  onUploadMedia={uploadMedia}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Metadata sidebar */}
        <div className="w-[280px] shrink-0 p-6 pl-0">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Info</p>
            <div className="space-y-3 text-[13px]">
              <div>
                <p className="text-gray-400 text-xs">Type</p>
                <p className="text-gray-700 font-medium">Single Type</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">UID</p>
                <p className="text-gray-700 font-mono text-xs">{ct.uid}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Locale</p>
                <p className="text-gray-700 font-medium">{locale === "en" ? "English" : "Español"}</p>
              </div>
              {entry && (
                <>
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-gray-400 text-xs">Created</p>
                    <p className="text-gray-700 text-xs">{new Date(entry.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Last updated</p>
                    <p className="text-gray-700 text-xs">{new Date(entry.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Status</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      entry.published
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${entry.published ? "bg-emerald-500" : "bg-gray-400"}`} />
                      {entry.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
