import { Check, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useHttpHeaders } from "@/hooks/http/useHttpHeaders";
import type { HttpHeader } from "@/types/http";
import { cn } from "@/utils";

interface HeadersTabProps {
  className?: string;
}

const HeadersTab = ({ className }: HeadersTabProps) => {
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

  const handleHeaderKeyChange = useCallback(
    (id: string, key: string) => {
      const headers = request?.request.headers || [];
      updateHeaderKey(id, key);
      const header = headers.find((h) => h.id === id);
      if (header && !header.enabled && key.trim()) {
        toggleHeader(id);
      }
    },
    [request, updateHeaderKey, toggleHeader],
  );

  const handleHeaderValueChange = useCallback(
    (id: string, value: string) => {
      const headers = request?.request.headers || [];
      updateHeaderValue(id, value);
      const header = headers.find((h) => h.id === id);
      if (header && !header.enabled && value.trim()) {
        toggleHeader(id);
      }
    },
    [request, updateHeaderValue, toggleHeader],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, headerId: string) => {
      const headers = request?.request.headers || [];
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
    },
    [request],
  );

  const headers = request?.request.headers || [];
  const enabledCount = headers.filter(
    (h) => h.enabled && (h.key.trim() || h.value.trim()),
  ).length;
  const totalCount = headers.filter(
    (h) => h.key.trim() || h.value.trim(),
  ).length;

  const renderHeaderRow = useCallback(
    (header: HttpHeader, index: number) => (
      <div
        key={header.id}
        className="grid grid-cols-12 gap-4 items-center py-3 border-b border-border hover:bg-accent transition-colors duration-150"
        role="row"
      >
        <div className="col-span-1" role="gridcell">
          <button
            type="button"
            onClick={() => toggleHeader(header.id)}
            className={cn(
              "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 focus:ring-2 focus:ring-primary focus:ring-offset-2",
              header.enabled
                ? "bg-primary border-primary text-primary-foreground"
                : "border-border hover:border-primary",
            )}
            title={`${header.enabled ? "Disable" : "Enable"} header`}
            aria-label={`${header.enabled ? "Disable" : "Enable"} header ${header.key || "unnamed"}`}
            aria-checked={header.enabled}
            role="checkbox"
          >
            {header.enabled && (
              <span className="text-xs font-bold" aria-hidden="true">
                ✓
              </span>
            )}
          </button>
        </div>

        <div className="col-span-5" role="gridcell">
          <input
            type="text"
            value={header.key}
            onChange={(e) => handleHeaderKeyChange(header.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, header.id)}
            onFocus={() => setFocusedHeader(header.id)}
            onBlur={() => setFocusedHeader(null)}
            placeholder="Header name"
            className={cn(
              "w-full px-3 py-2 bg-transparent text-foreground text-sm border-none focus:outline-none focus:bg-accent rounded placeholder-muted-foreground transition-colors duration-150",
              "focus:ring-2 focus:ring-primary focus:ring-offset-1",
            )}
            aria-label="Header name"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="col-span-1 flex justify-center" role="gridcell">
          <span className="text-muted-foreground font-medium">:</span>
        </div>

        <div className="col-span-4" role="gridcell">
          <input
            type="text"
            value={header.value}
            onChange={(e) => handleHeaderValueChange(header.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, header.id)}
            onFocus={() => setFocusedHeader(header.id)}
            onBlur={() => setFocusedHeader(null)}
            placeholder="Header value"
            className={cn(
              "w-full px-3 py-2 bg-transparent text-foreground text-sm border-none focus:outline-none focus:bg-accent rounded placeholder-muted-foreground transition-colors duration-150",
              "focus:ring-2 focus:ring-primary focus:ring-offset-1",
            )}
            aria-label="Header value"
            autoComplete="off"
          />
        </div>

        <div className="col-span-1" role="gridcell">
          {index < headers.length - 1 && (
            <button
              type="button"
              onClick={() => removeHeader(header.id)}
              className="p-1 rounded text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-150 focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              title="Delete header"
              aria-label={`Delete header ${header.key || "unnamed"}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    ),
    [
      handleHeaderKeyChange,
      handleHeaderValueChange,
      handleKeyDown,
      toggleHeader,
      removeHeader,
      headers.length,
    ],
  );

  if (!request) return null;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4">
          <div
            className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border pb-2 mb-4"
            role="row"
            aria-label="Table header"
          >
            <div
              className="col-span-1"
              role="columnheader"
              aria-label="Enabled"
            >
            </div>
            <div className="col-span-5" role="columnheader">
              Header Name
            </div>
            <div
              className="col-span-1"
              role="columnheader"
              aria-label="Separator"
            >
            </div>
            <div className="col-span-4" role="columnheader">
              Header Value
            </div>
            <div
              className="col-span-1"
              role="columnheader"
              aria-label="Actions"
            >
            </div>
          </div>

          <div role="grid" aria-label="Headers table">
            {request.request.headers.map(renderHeaderRow)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadersTab;
