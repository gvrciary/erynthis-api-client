import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useHttpHeaders } from "@/hooks/http/useHttpHeaders";
import type { HttpHeader } from "@/types/http";

interface HeadersTabProps {
  className?: string;
}

const HeadersTab = ({ className } : HeadersTabProps) => {
  const {
    getSelectedRequest,
    addHeader,
    updateHeaderKey,
    updateHeaderValue,
    toggleHeader,
    removeHeader,
  } = useHttpHeaders();
  const [focusedHeader, setFocusedHeader] = useState<string | null>(null);
  const request = getSelectedRequest();

  useEffect(() => {
    const headers = request?.request.headers || [];

    if (
      headers.length === 0 ||
      headers[headers.length - 1].key.trim() ||
      headers[headers.length - 1].value.trim()
    ) {
      addHeader();
    }
  }, [request, addHeader]);

  if (!request) return null;

  const handleHeaderKeyChange = (id: string, key: string) => {
    const headers = request.request.headers || [];
    updateHeaderKey(id, key);
    const header = headers.find((h) => h.id === id);
    if (header && !header.enabled && key.trim()) {
      toggleHeader(id);
    }
  };

  const handleHeaderValueChange = (id: string, value: string) => {
    const headers = request.request.headers || [];
    updateHeaderValue(id, value);
    const header = headers.find((h) => h.id === id);
    if (header && !header.enabled && value.trim()) {
      toggleHeader(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, headerId: string) => {
    const headers = request.request.headers || [];
    if (e.key === "Enter") {
      e.preventDefault();
      const currentIndex = headers.findIndex((h) => h.id === headerId);
      const nextHeader = headers[currentIndex + 1];
      if (nextHeader) {
        setFocusedHeader(nextHeader.id);
      }
    } else if (e.key === "Escape") {
      setFocusedHeader(null);
    }
  };

  const headers = request.request.headers || [];
  const enabledCount = headers.filter(
    (h) => h.enabled && (h.key.trim() || h.value.trim()),
  ).length;
  const totalCount = headers.filter(
    (h) => h.key.trim() || h.value.trim(),
  ).length;

  const renderHeaderRow = (header: HttpHeader, index: number) => (
    <div
      key={header.id}
      className={`group relative p-3 rounded-lg border ${
        header.enabled
          ? "bg-card border-border hover:border-primary hover:bg-accent"
          : "bg-muted border-border opacity-60"
      }`}
    >
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => toggleHeader(header.id)}
          className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center ${
            header.enabled
              ? "bg-primary border-primary"
              : "bg-transparent border-border hover:border-primary"
          }`}
        >
          {header.enabled && (
            <Check
              className="h-2.5 w-2.5 text-primary-foreground"
              strokeWidth={3}
            />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={header.key}
            onChange={(e) => handleHeaderKeyChange(header.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, header.id)}
            onFocus={() => setFocusedHeader(header.id)}
            onBlur={() => setFocusedHeader(null)}
            placeholder="Header name"
            className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground  outline-none text-sm  ${
              focusedHeader === header.id
                ? "border-primary focus-ring"
                : "border-border hover:border-primary"
            }`}
          />
        </div>

        <div className="flex-shrink-0 text-muted-foreground font-medium ">
          :
        </div>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={header.value}
            onChange={(e) => handleHeaderValueChange(header.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, header.id)}
            onFocus={() => setFocusedHeader(header.id)}
            onBlur={() => setFocusedHeader(null)}
            placeholder="Header value"
            className={`w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground outline-none text-sm  ${
              focusedHeader === header.id
                ? "border-primary focus-ring"
                : "hover:border-primary"
            }`}
          />
        </div>

        {index < request.request.headers.length - 1 && (
          <button
            type="button"
            onClick={() => removeHeader(header.id)}
            className="flex-shrink-0 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-100 text-muted-foreground hover:text-red-600"
            title="Remove header"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="absolute top-2 right-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
        {index + 1}
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full bg-card ${className}`}>
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-medium text-foreground ">Headers</h3>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground ">
              <span className="px-2 py-1 bg-accent text-accent-foreground rounded font-medium">
                {enabledCount} enabled
              </span>
              <span className="px-2 py-1 bg-muted text-muted-foreground rounded">
                {totalCount} total
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 space-y-2">
          {request.request.headers.map(renderHeaderRow)}
        </div>
      </div>
    </div>
  );
};

export default HeadersTab;