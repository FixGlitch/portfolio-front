"use client"

import { useState } from "react"
import { TopBar } from "./top-bar"
import { FieldEditor } from "./field-editor"
import { useMediaUpload } from "./use-media-upload"
import type { ContentType, Entry, ToastMsg, View } from "./types"

export function CollectionEditor({
  ct,
  entry,
  locale,
  onBack,
  toast,
}: {
  ct: ContentType;
  entry: Entry | null;
  locale: string;
  onBack: () => void;
  toast: (t: ToastMsg) => void;
}) {
  const [data, setData] = useState<Record<string, string>>(entry?.data || {});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const isNew = !entry?.id;
  const uploadMedia = useMediaUpload(toast);

  function handleChange(key: string, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    const body = {
      contentTypeUid: ct.uid,
      locale,
      data,
      ...(entry?.id ? { entryId: entry.id } : {}),
    };
    const res = await fetch("/api/entries/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      setDirty(false);
      toast({ message: isNew ? "Entry created" : "Entry saved", type: "success" });
      onBack();
    } else {
      toast({ message: "Failed to save", type: "error" });
    }
  }

  const view: View = entry?.id
    ? { type: "collectionEdit", ct, entry }
    : { type: "collectionList", ct };

  return (
    <>
      <TopBar view={view} onBack={onBack}>
        {dirty && (
          <span className="text-xs text-amber-600 font-semibold mr-2">Unsaved changes</span>
        )}
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="px-4 py-2 bg-[#4945ff] text-white rounded-lg text-sm font-semibold hover:bg-[#3b36d4] transition disabled:opacity-40"
        >
          {saving ? "Saving..." : isNew ? "Create" : "Save"}
        </button>
      </TopBar>

      <div className="flex">
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

        <div className="w-[280px] shrink-0 p-6 pl-0">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Info</p>
            <div className="space-y-3 text-[13px]">
              <div>
                <p className="text-gray-400 text-xs">Type</p>
                <p className="text-gray-700 font-medium">{ct.displayName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Locale</p>
                <p className="text-gray-700 font-medium">{locale === "en" ? "English" : "Español"}</p>
              </div>
              {entry?.id && (
                <>
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-gray-400 text-xs">ID</p>
                    <p className="text-gray-700 font-mono text-[10px] break-all">{entry.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Created</p>
                    <p className="text-gray-700 text-xs">{new Date(entry.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Last updated</p>
                    <p className="text-gray-700 text-xs">{new Date(entry.updatedAt).toLocaleDateString()}</p>
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
