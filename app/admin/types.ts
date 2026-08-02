export interface FieldDef {
  name: string;
  label: string;
  type: "text" | "longText" | "json" | "media" | "boolean" | "number";
  required?: boolean;
  placeholder?: string;
}

export interface ContentType {
  id: string;
  uid: string;
  displayName: string;
  kind: "singleType" | "collectionType";
  schema: FieldDef[];
  _count?: { entries: number };
}

export interface Entry {
  id: string;
  uid: string;
  contentTypeId: string;
  locale: string;
  data: Record<string, string>;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  alt: string | null;
  url: string;
  mime: string;
  size: number;
  createdAt: string;
}

export type ToastMsg = { message: string; type: "success" | "error" };

export type View =
  | { type: "home" }
  | { type: "singleType"; ct: ContentType }
  | { type: "collectionList"; ct: ContentType }
  | { type: "collectionEdit"; ct: ContentType; entry: Entry | null }
  | { type: "media" }
  | { type: "builder"; ct?: ContentType }
  | { type: "settings" };
