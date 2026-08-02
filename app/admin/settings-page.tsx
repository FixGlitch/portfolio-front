"use client"

import { useState, useEffect } from "react"
import { TopBar } from "./top-bar"
import type { ToastMsg } from "./types"

const SETTINGS_FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: "siteName", label: "Site Name", placeholder: "Lucas Blanco" },
  { key: "siteUrl", label: "Site URL", placeholder: "https://fixglitch.dev" },
  { key: "email", label: "Email", placeholder: "hello@example.com" },
  { key: "github", label: "GitHub URL", placeholder: "https://github.com/username" },
  { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/username" },
  { key: "location", label: "Location", placeholder: "Argentina" },
];

export function SettingsPage({
  locale,
  toast,
}: {
  locale: string;
  toast: (t: ToastMsg) => void;
}) {
  const [data, setData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch(`/api/entries?contentType=singleType.settings&locale=${locale}`)
      .then((r) => r.json())
      .then((e) => {
        setData(e?.data || {});
      });
  }, [locale]);

  function handleChange(key: string, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/entries/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentTypeUid: "singleType.settings", locale, data }),
    });
    setSaving(false);
    if (res.ok) {
      setDirty(false);
      toast({ message: "Settings saved", type: "success" });
    } else {
      toast({ message: "Failed to save", type: "error" });
    }
  }

  return (
    <>
      <TopBar view={{ type: "settings" }}>
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="px-4 py-2 bg-[#4945ff] text-white rounded-lg text-sm font-semibold hover:bg-[#3b36d4] transition disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </TopBar>
      <div className="p-6 max-w-2xl">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-sm text-gray-500 mb-6">Manage your site-wide settings and social links.</p>
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          {SETTINGS_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-[13px] font-semibold text-gray-700 mb-1.5 block">{f.label}</label>
              <input
                value={data[f.key] || ""}
                onChange={(e) => handleChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#4945ff] focus:border-transparent transition"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
