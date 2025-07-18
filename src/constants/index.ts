import {
  Code,
  Database,
  File,
  FileCode,
  FileText,
  Globe,
  Grid,
  Hash,
  Key,
  Link,
  LinkIcon,
  Lock,
  Settings,
  Shield,
  Upload,
  User
} from "lucide-react";
import type { DropdownOption } from "../types/data";

export const httpMethods = [
  {
    value: "GET",
    label: "GET",
    color:
      "text-blue-700 bg-blue-50 border-blue-300 dark:text-blue-300 dark:bg-blue-950 dark:border-blue-700",
  },
  {
    value: "POST",
    label: "POST",
    color:
      "text-green-700 bg-green-50 border-green-300 dark:text-green-300 dark:bg-green-950 dark:border-green-700",
  },
  {
    value: "PUT",
    label: "PUT",
    color:
      "text-orange-700 bg-orange-50 border-orange-300 dark:text-orange-300 dark:bg-orange-950 dark:border-orange-700",
  },
  {
    value: "DELETE",
    label: "DELETE",
    color:
      "text-red-700 bg-red-50 border-red-300 dark:text-red-300 dark:bg-red-950 dark:border-red-700",
  },
  {
    value: "PATCH",
    label: "PATCH",
    color:
      "text-purple-700 bg-purple-50 border-purple-300 dark:text-purple-300 dark:bg-purple-950 dark:border-purple-700",
  },
  {
    value: "HEAD",
    label: "HEAD",
    color: "text-muted-foreground bg-muted border-border",
  },
  {
    value: "OPTIONS",
    label: "OPTIONS",
    color: "text-muted-foreground bg-muted border-border",
  },
  {
    value: "CUSTOM",
    label: "CUSTOM",
    color: "text-muted-foreground bg-muted border-border",
  },
] as DropdownOption[];

export const AUTH_TYPES = [
  { value: "none", label: "No Auth", icon: Shield },
  { value: "inherit", label: "Inherit from Parent", icon: LinkIcon },
  { value: "basic", label: "Basic Auth", icon: User },
  { value: "bearer", label: "Bearer Token", icon: Key },
  { value: "apikey", label: "API Key", icon: Lock },
  { value: "oauth2", label: "OAuth 2.0", icon: Globe },
  { value: "custom", label: "Custom", icon: Settings },
] as DropdownOption[];

export const BODY_TYPES = [
  { value: "none", label: "No Body", icon: FileText },
  { value: "text", label: "Text", icon: File },
  { value: "form", label: "Form Data", icon: FileCode },
  { value: "binary", label: "Binary", icon: Upload },
  { value: "graphql", label: "GraphQL", icon: Hash },
] as DropdownOption[];

export const TEXT_SUBTYPES = [
  { value: "raw", label: "Raw", icon: File },
  { value: "json", label: "JSON", icon: Code },
  { value: "xml", label: "XML", icon: Database },
  { value: "yaml", label: "YAML", icon: Settings },
] as DropdownOption[];

export const FORM_SUBTYPES = [
  { value: "urlencoded", label: "URL Encoded", icon: Link },
  { value: "multipart", label: "Multipart", icon: Grid },
] as DropdownOption[];

export const TABS = [
  { id: "body", label: "Body" },
  { id: "headers", label: "Headers" },
  { id: "auth", label: "Auth" },
  { id: "params", label: "Params" },
  { id: "generate", label: "Code" },
];

export const RESPONSE_TABS = (headerCount: number) => [
  { id: "body", label: "Body" },
  { id: "headers", label: `Headers (${headerCount})` },
];