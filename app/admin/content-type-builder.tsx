"use client"

import { useState } from "react"
import { TopBar } from "./top-bar"
import { Icon } from "./icons"
import type { ContentType, FieldDef, ToastMsg, View } from "./types"

const FIELD_TYPES: { type: FieldDef["type"]; label: string; icon: string }[] = [
  { type: "text", label: "Text", icon: "T" },
  { type: "longText", label: "Long Text", icon: "¶" },
  { type: "number", label: "Number", icon: "#" },
  { type: "boolean", label: "Boolean", icon: "◉" },
  { type: "json", label: "JSON", icon: "{}" },
  { type: "media", label: "Media", icon: "🖼" },
];

export function ContentTypeBuilder({
  editingCt,
  onRefresh,
  toast,
  onNavigate,
}: {
  editingCt?: ContentType;
  onRefresh: () => void;
  toast: (t: ToastMsg) => void;
  onNavigate: (v: View) => void;
}) {
  const [schema, setSchema] = useState<FieldDef[]>(editingCt?.schema || []);
  const [name, setName] = useState(editingCt?.displayName || "");
  const [uid, setUid] = useState(editingCt?.uid || "");
  const [kind, setKind] = useState<"singleType" | "collectionType">(editingCt?.kind || "singleType");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showFieldPicker, setShowFieldPicker] = useState(false);
  const isEditing = !!editingCt;

  function addField(type: FieldDef["type"]) {
    const typeInfo = FIELD_TYPES.find((ft) => ft.type === type);
    const count = schema.filter((f) => f.type === type).length;
    const nameSuggestion = type === "media"
      ? `field${count > 0 ? count + 1 : ""}`
      : `${type}${count > 0 ? count + 1 : ""}`;
    setSchema((prev) => [
      ...prev,
      { name: nameSuggestion, label: `${typeInfo?.label || type} ${count > 0 ? count + 1 : ""}`, type, required: false },
    ]);
    setDirty(true);
    setShowFieldPicker(false);
  }

  function updateField(index: number, field: Partial<FieldDef>) {
    setSchema((prev) => prev.map((f, i) => (i === index ? { ...f, ...field } : f)));
    setDirty(true);
  }

  function removeField(index: number) {
    setSchema((prev) => prev.filter((_, i) => i !== index));
    setDirty(true);
  }

  function moveField(from: number, to: number) {
    if (to < 0 || to >= schema.length) return;
    const next = [...schema];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setSchema(next);
    setDirty(true);
  }

  async function handleSave() {
    if (!name || !uid) {
      toast({ message: "Name and UID are required", type: "error" });
      return;
    }
    setSaving(true);
    const method = isEditing ? "PATCH" : "POST";
    const res = await fetch("/api/content-types/create", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, displayName: name, kind, schema }),
    });
    setSaving(false);
    if (res.ok) {
      toast({ message: isEditing ? "Updated!" : "Created!", type: "success" });
      setDirty(false);
      onRefresh();
    } else {
      const err = await res.json();
      toast({ message: err.error || "Failed", type: "error" });
    }
  }

  return (
    <>
      <TopBar view={{ type: "builder", ct: editingCt }} onBack={() => onNavigate({ type: "home" })}>
        {dirty && (
          <span className="text-xs text-amber-600 font-semibold mr-2">Unsaved changes</span>
        )}
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="px-4 py-2 bg-[#4945ff] text-white rounded-lg text-sm font-semibold hover:bg-[#3b36d4] transition disabled:opacity-40"
        >
          {saving ? "Saving..." : isEditing ? "Update" : "Create"}
        </button>
      </TopBar>

      <div className="p-6 max-w-3xl">
        {/* Basic Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Basic Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Display Name</label>
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); setDirty(true); }}
                placeholder="My Content Type"
                disabled={isEditing}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#4945ff]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">UID</label>
              <input
                value={uid}
                onChange={(e) => { setUid(e.target.value); setDirty(true); }}
                placeholder="singleType.mytype"
                disabled={isEditing}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#4945ff]"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Type</label>
              <div className="flex gap-3">
                {(["singleType", "collectionType"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => { if (!isEditing) { setKind(k); setDirty(true); } }}
                    disabled={isEditing}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 ${
                      kind === k
                        ? "bg-[#4945ff] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {k === "singleType" ? "Single Type" : "Collection Type"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fields</h2>
            <button
              onClick={() => setShowFieldPicker(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition"
            >
              <Icon.Plus /> Add field
            </button>
          </div>

          {schema.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-400 mb-3">No fields yet.</p>
              <button
                onClick={() => setShowFieldPicker(true)}
                className="px-4 py-2 bg-[#4945ff] text-white rounded-lg text-sm font-semibold hover:bg-[#3b36d4] transition"
              >
                Add your first field
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {schema.map((field, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition"
                >
                  <button className="p-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing">
                    <Icon.GripVertical />
                  </button>
                  <button
                    onClick={() => moveField(i, i - 1)}
                    disabled={i === 0}
                    className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveField(i, i + 1)}
                    disabled={i === schema.length - 1}
                    className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <span className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400">
                    {FIELD_TYPES.find((ft) => ft.type === field.type)?.icon || "?"}
                  </span>
                  <input
                    value={field.name}
                    onChange={(e) => updateField(i, { name: e.target.value })}
                    className="w-28 border border-gray-200 rounded px-2 py-1 bg-white text-xs text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#4945ff]"
                  />
                  <input
                    value={field.label}
                    onChange={(e) => updateField(i, { label: e.target.value })}
                    className="w-36 border border-gray-200 rounded px-2 py-1 bg-white text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#4945ff]"
                  />
                  <select
                    value={field.type}
                    onChange={(e) => updateField(i, { type: e.target.value as FieldDef["type"] })}
                    className="border border-gray-200 rounded px-2 py-1 bg-white text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4945ff]"
                  >
                    {FIELD_TYPES.map((ft) => (
                      <option key={ft.type} value={ft.type}>{ft.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => updateField(i, { required: !field.required })}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition ${
                      field.required
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {field.required ? "REQ" : "opt"}
                  </button>
                  <button
                    onClick={() => removeField(i)}
                    className="p-1 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                  >
                    <Icon.Trash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Field Type Picker Modal */}
        {showFieldPicker && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Pick a field type</h3>
              <div className="grid grid-cols-3 gap-3">
                {FIELD_TYPES.map((ft) => (
                  <button
                    key={ft.type}
                    onClick={() => addField(ft.type)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-[#4945ff] hover:bg-blue-50 transition"
                  >
                    <span className="text-2xl">{ft.icon}</span>
                    <span className="text-xs font-semibold text-gray-700">{ft.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowFieldPicker(false)}
                className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
