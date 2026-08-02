"use client"

import Image from "next/image"
import { Icon } from "./icons"
import type { FieldDef } from "./types"

export function FieldEditor({
  field,
  value,
  onChange,
  onUploadMedia,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
  onUploadMedia?: (file: File, alt: string) => void;
}) {
  if (field.type === "longText" || (field.type === "json" && value.length > 100)) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#4945ff] focus:border-transparent transition resize-y"
        rows={6}
      />
    );
  }

  if (field.type === "media") {
    let mediaUrl = "";
    try {
      const parsed = JSON.parse(value);
      mediaUrl = typeof parsed === "string" ? parsed : parsed?.url || "";
    } catch {
      mediaUrl = value;
    }

    return (
      <div className="flex flex-col gap-3">
        {mediaUrl && (
          <div className="relative w-40 h-40 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
            <Image src={mediaUrl} alt={field.label} width={160} height={160} className="w-full h-full object-cover" />
            <button
              onClick={() => onChange("")}
              className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              <Icon.X />
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <label className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-200 transition cursor-pointer">
            Upload image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && onUploadMedia) onUploadMedia(file, field.label);
              }}
              className="hidden"
            />
          </label>
          <span className="text-gray-400 text-xs">or</span>
          <input
            type="text"
            value={mediaUrl}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste image URL"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#4945ff]"
          />
        </div>
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <button
        type="button"
        onClick={() => onChange(value === "true" ? "false" : "true")}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          value === "true" ? "bg-[#4945ff]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            value === "true" ? "translate-x-5" : ""
          }`}
        />
      </button>
    );
  }

  if (field.type === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#4945ff] focus:border-transparent"
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#4945ff] focus:border-transparent transition"
    />
  );
}
