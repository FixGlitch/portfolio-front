"use client"

import Image from "next/image"
import { useRef, useState, type DragEvent } from "react"
import { TopBar } from "./top-bar"
import { Icon } from "./icons"
import type { MediaItem, ToastMsg } from "./types"

export function MediaLibrary({
  items,
  onRefresh,
  toast,
}: {
  items: MediaItem[];
  onRefresh: () => void;
  toast: (t: ToastMsg) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt", file.name);
    const res = await fetch("/api/media", { method: "POST", body: fd });
    if (res.ok) {
      toast({ message: `"${file.name}" uploaded`, type: "success" });
      onRefresh();
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    files.forEach(uploadFile);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach(uploadFile);
    e.target.value = "";
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this media file?")) return;
    const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ message: "File deleted", type: "success" });
      onRefresh();
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast({ message: "URL copied!", type: "success" });
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  }

  return (
    <>
      <TopBar view={{ type: "media" }}>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#4945ff] text-white rounded-lg text-sm font-semibold hover:bg-[#3b36d4] transition"
        >
          <Icon.Plus /> Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </TopBar>

      <div className="p-6">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition mb-6 ${
            dragOver
              ? "border-[#4945ff] bg-blue-50"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
            <Icon.Upload />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Drag & drop images here
          </p>
          <p className="text-xs text-gray-400">
            or{" "}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[#4945ff] font-semibold hover:underline"
            >
              browse files
            </button>
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">No media files yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((m) => (
              <div
                key={m.id}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <Image src={m.url} alt={m.alt || m.name} width={400} height={400} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => copyUrl(m.url)}
                      className="p-2 bg-white/90 rounded-lg text-gray-700 hover:bg-white transition text-xs font-semibold"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-2 bg-red-500/90 rounded-lg text-white hover:bg-red-500 transition"
                    >
                      <Icon.Trash />
                    </button>
                  </div>
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-xs font-medium text-gray-900 truncate">{m.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{formatSize(m.size)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
