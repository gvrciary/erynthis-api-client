import type { HttpError, HttpRequest, HttpResponse } from "./http";

export interface CodeTemplate {
  id: string;
  name: string;
  language: string;
  generate: (request: HttpRequest) => string;
}

export interface Variable {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface DropdownOption {
  value: string;
  label: string;
  color?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Environment {
  id: string;
  name: string;
  variables: Variable[];
}

export interface ResponseHistoryItem {
  id: string;
  timestamp: number;
  response?: HttpResponse;
  error?: HttpError;
}

export interface RequestItem {
  id: string;
  name: string;
  request: HttpRequest;
  responses: ResponseHistoryItem[];
  selectedResponseId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface FolderItem {
  id: string;
  name: string;
  expanded: boolean;
  requests: string[];
}

export interface Settings {
  theme: "light" | "dark";
}

export type AuthType =
  | "none"
  | "inherit"
  | "basic"
  | "bearer"
  | "apikey"
  | "oauth2"
  | "custom";

export type BodyType = "none" | "text" | "form" | "binary" | "graphql";
export type TextSubtype = "raw" | "json" | "xml" | "yaml";
export type FormSubtype = "urlencoded" | "multipart";
export type ItemsType = "request" | "folder"
export type EnvironmentScope = "environments" | "globals";
