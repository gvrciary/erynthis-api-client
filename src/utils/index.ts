import { httpMethods } from "@/constants";
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const generateId = (name: string = ""): string => {
  return `${name !== "" ? `${name}_` : ""}${crypto.randomUUID().slice(2, 9)}`;
};

export const getMethodColor = (method: string): string => {
  return (
    httpMethods.find((m) => m.value.toLowerCase() === method.toLowerCase())
      ?.color || "text-muted-foreground bg-muted border-border"
  );
};

export const formatResponseTime = (time: number): string => {
  if (time < 1000) {
    return `${time}ms`;
  } else if (time < 60000) {
    return `${(time / 1000).toFixed(2)}s`;
  } else {
    return `${(time / 60000).toFixed(2)}m`;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const pow = k ** i;
  return `${parseFloat((bytes / pow).toFixed(2))} ${sizes[i]}`;
};

export const getStatusColor = (status: number): string => {
  if (status >= 200 && status < 300) {
    return "text-green-600";
  } else if (status >= 300 && status < 400) {
    return "text-yellow-600";
  } else if (status >= 400) {
    return "text-red-600";
  }
  return "text-gray-600";
};
