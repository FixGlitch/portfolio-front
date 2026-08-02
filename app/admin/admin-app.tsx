"use client";

import { useState, useEffect, useCallback } from "react";
import { Toast } from "./toast";
import { Sidebar } from "./sidebar";
import { LoginScreen } from "./login-screen";
import { Dashboard } from "./dashboard";
import { SingleTypeEditor } from "./single-type-editor";
import { CollectionList } from "./collection-list";
import { CollectionEditor } from "./collection-editor";
import { MediaLibrary } from "./media-library";
import { ContentTypeBuilder } from "./content-type-builder";
import { SettingsPage } from "./settings-page";
import type { ContentType, MediaItem, ToastMsg, View } from "./types";

export function AdminApp() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [view, setView] = useState<View>({ type: "home" });
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "" }),
    })
      .then((r) => r.ok && setAuthenticated(true))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const loadTypes = useCallback(async () => {
    const res = await fetch("/api/content-types");
    if (res.ok) setContentTypes(await res.json());
  }, []);

  const loadMedia = useCallback(async () => {
    const res = await fetch("/api/media");
    if (res.ok) setMediaItems(await res.json());
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    (async () => {
      const [typesRes, mediaRes] = await Promise.all([
        fetch("/api/content-types"),
        fetch("/api/media"),
      ]);
      if (typesRes.ok) setContentTypes(await typesRes.json());
      if (mediaRes.ok) setMediaItems(await mediaRes.json());
    })();
  }, [authenticated]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="w-6 h-6 border-2 border-[#4945ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex bg-[#f5f5f7]">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <Sidebar
        contentTypes={contentTypes}
        view={view}
        onNavigate={setView}
        locale={locale}
        onLocaleChange={setLocale}
      />

      <main className="flex-1 min-h-screen overflow-x-hidden">
        {view.type === "home" && (
          <Dashboard contentTypes={contentTypes} onNavigate={setView} />
        )}
        {view.type === "singleType" && (
          <SingleTypeEditor
            ct={view.ct}
            locale={locale}
            toast={setToast}
            onNavigate={setView}
          />
        )}
        {view.type === "collectionList" && (
          <CollectionList
            ct={view.ct}
            locale={locale}
            onEdit={(entry) => setView({ type: "collectionEdit", ct: view.ct, entry })}
            onNew={() =>
              setView({
                type: "collectionEdit",
                ct: view.ct,
                entry: null,
              })
            }
            onNavigate={setView}
            toast={setToast}
          />
        )}
        {view.type === "collectionEdit" && (
          <CollectionEditor
            ct={view.ct}
            entry={view.entry}
            locale={locale}
            onBack={() => setView({ type: "collectionList", ct: view.ct })}
            toast={setToast}
          />
        )}
        {view.type === "media" && (
          <MediaLibrary
            items={mediaItems}
            onRefresh={loadMedia}
            toast={setToast}
          />
        )}
        {view.type === "builder" && (
          <ContentTypeBuilder
            editingCt={view.ct}
            onRefresh={loadTypes}
            toast={setToast}
            onNavigate={setView}
          />
        )}
        {view.type === "settings" && (
          <SettingsPage locale={locale} toast={setToast} />
        )}
      </main>
    </div>
  );
}
